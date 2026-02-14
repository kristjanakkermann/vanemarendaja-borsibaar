# Week 4 Lessons: Docker & CI/CD for microerp-rails

Takeaways from Börsibaar (Spring Boot + Next.js Docker setup) applied to Rails.

---

## Rails Dockerfile (Multi-stage)

Börsibaar uses JDK build → JRE runtime. Rails equivalent:

```dockerfile
# Build stage
FROM ruby:3.3-slim AS build
WORKDIR /app

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs npm
RUN npm install -g yarn

COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment true && \
    bundle config set --local without 'development test' && \
    bundle install

COPY . .
RUN SECRET_KEY_BASE=dummy bundle exec rails assets:precompile

# Runtime stage
FROM ruby:3.3-slim
WORKDIR /app

RUN apt-get update -qq && apt-get install -y libpq-dev curl

COPY --from=build /app /app

EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
```

**Key differences from Spring Boot:**
- Rails needs asset precompilation (like Next.js build)
- Ruby doesn't have a separate "runtime-only" image like JRE vs JDK
- Puma is the app server (like embedded Tomcat in Spring Boot)

## docker-compose for Rails + PostgreSQL + Redis

Börsibaar pattern adapted for Rails:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  web:
    build: .
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379/0
      RAILS_ENV: production
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    depends_on:
      - postgres
      - redis
    expose:
      - "3000"

  sidekiq:
    build: .
    command: bundle exec sidekiq
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:
```

**Extra vs Börsibaar:** Rails typically needs Redis (for caching, Sidekiq jobs) and a separate Sidekiq worker container.

## NGINX + Puma Reverse Proxy

Börsibaar's NGINX config maps almost directly. Key difference: Puma instead of Next.js/Spring Boot:

```nginx
upstream rails_app {
    server web:3000;
}

server {
    listen 443 ssl http2;
    server_name microerp.example.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://rails_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rails serves static assets from public/
    location /assets/ {
        root /app/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## GitHub Actions CI/CD for Rails

Börsibaar's pipeline adapted:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: password
        ports: ["5432:5432"]
        options: --health-cmd pg_isready

    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true

      - name: Setup DB
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/test
        run: bundle exec rails db:create db:migrate

      - name: Run tests
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/test
        run: bundle exec rails test

      - name: Lint
        run: bundle exec rubocop

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Deploy via SSH (same pattern as Börsibaar)
      # Or use Kamal (see below)
```

## Deployment: Kamal vs Docker Compose

Börsibaar uses Docker Compose + SSH deploy. For Rails, consider **Kamal** (built by Rails team):

| Approach | Börsibaar Style (Docker Compose) | Kamal |
|---|---|---|
| Config | `docker-compose.prod.yml` | `config/deploy.yml` |
| Deploy | CI/CD SSH + tar + docker compose up | `kamal deploy` |
| Zero-downtime | Manual (down → up) | Built-in (rolling) |
| SSL | Manual Certbot/nginx | Built-in via Traefik |
| Complexity | Low, full control | Low, convention-based |

Kamal example (`config/deploy.yml`):
```yaml
service: microerp
image: ghcr.io/user/microerp
servers:
  web:
    - 1.2.3.4
registry:
  username: user
  password:
    - KAMAL_REGISTRY_PASSWORD
```

Deploy: `kamal deploy` (handles Docker build, push, rolling restart).

## Rails Credentials vs .env

Börsibaar uses `.env` files with Spring DotEnv. Rails has built-in encrypted credentials:

```bash
# Edit credentials (encrypted, committed to git)
rails credentials:edit

# Access in code
Rails.application.credentials.dig(:database, :password)
```

**Recommendation for microerp-rails:** Use Rails credentials for secrets (API keys, DB passwords) and `.env` only for environment-specific config (DATABASE_URL, REDIS_URL). This is more secure than Börsibaar's approach of `.env` files for everything.

## Key Takeaway

The Börsibaar Docker/CI/CD patterns transfer directly to Rails. Main differences: (1) add Redis/Sidekiq to the stack, (2) consider Kamal instead of manual Docker Compose deploy, (3) use Rails credentials instead of .env for secrets.
