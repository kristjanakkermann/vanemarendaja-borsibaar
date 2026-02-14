# Week 3 Lessons: Testing Patterns for microerp-rails

Takeaways from Börsibaar (Spring Boot + JUnit/Mockito) applied to Rails.

---

## Java → Rails Testing Equivalents

| Java / Spring Boot | Rails Equivalent |
|---|---|
| JUnit 5 | Minitest (default) or RSpec |
| Mockito (`@Mock`, `@InjectMocks`) | RSpec mocks/doubles, or Mocha gem |
| `@SpringBootTest` | `ActionDispatch::IntegrationTest` / RSpec request specs |
| MockMvc (`perform(get(...))`) | `get`, `post`, `delete` helpers in request specs |
| `@DataJpaTest` | Model tests with `ActiveSupport::TestCase` |
| H2 in-memory DB | SQLite in-memory or test PostgreSQL with `database_cleaner` |
| MapStruct mapper tests | No equivalent needed (Rails doesn't use DTOs typically) |
| Spring Security Test | Devise test helpers / Warden test helpers |
| `@MockitoBean` | `allow(Service).to receive(:method)` in RSpec |
| `ObjectMapper` for JSON | Built-in `as_json` / `response.parsed_body` |

## Test Structure in Rails

```
test/                          # Minitest (default)
├── models/                    # Unit tests (like Service tests)
├── controllers/               # Controller tests (like Controller integration tests)
├── integration/               # Full request cycle tests
├── system/                    # Browser tests (Capybara)
├── fixtures/                  # Test data (like @BeforeEach setup)
└── test_helper.rb             # Config (like @ExtendWith)

spec/                          # RSpec alternative
├── models/
├── requests/                  # Preferred over controller specs
├── system/
├── factories/                 # Factory Bot (like test builders)
└── spec_helper.rb
```

## Key Patterns to Apply

### 1. Service Layer Testing (Mockito → RSpec doubles)

**Börsibaar (Java):**
```java
@Mock private ProductRepository productRepository;
@InjectMocks private ProductService productService;

@Test
void create_Success() {
    when(productRepository.save(any())).thenReturn(product);
    ProductResponseDto result = productService.create(request, orgId);
    assertEquals("Product", result.name());
}
```

**Rails equivalent:**
```ruby
RSpec.describe ProductService do
  let(:repository) { instance_double(ProductRepository) }
  let(:service) { described_class.new(repository: repository) }

  it "creates a product" do
    allow(repository).to receive(:save).and_return(product)
    result = service.create(params, org_id)
    expect(result.name).to eq("Product")
  end
end
```

### 2. Controller/Request Testing (MockMvc → Request specs)

**Börsibaar (Java):**
```java
mockMvc.perform(post("/api/products")
    .contentType(MediaType.APPLICATION_JSON)
    .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.name").value("Test Product"));
```

**Rails equivalent:**
```ruby
RSpec.describe "Products API", type: :request do
  it "creates a product" do
    post "/api/products", params: { product: attributes }, as: :json
    expect(response).to have_http_status(:created)
    expect(response.parsed_body["name"]).to eq("Test Product")
  end
end
```

### 3. Factory Bot vs Spring Test Fixtures

**Börsibaar:** Manual object creation in each test (`new Product(); product.setName(...)`)

**Rails (better):** Factory Bot for reusable test data:
```ruby
FactoryBot.define do
  factory :product do
    name { "Test Beer" }
    base_price { 3.00 }
    association :category
    association :organization
  end
end

# Usage: create(:product, name: "Custom Beer")
```

### 4. System Tests (no Börsibaar equivalent)

Rails has built-in browser testing with Capybara:
```ruby
class LoginTest < ApplicationSystemTestCase
  test "user can log in" do
    visit login_path
    click_on "Login with Google"
    assert_text "Dashboard"
  end
end
```

## CI Testing with GitHub Actions (Rails)

```yaml
- name: Run tests
  run: |
    bundle exec rails db:create db:migrate
    bundle exec rails test        # Minitest
    # or: bundle exec rspec       # RSpec
```

## TDD in Rails

The Arrange-Act-Assert pattern from Börsibaar maps directly:

```ruby
it "rejects insufficient stock removal" do
  # Arrange
  product = create(:product)
  create(:inventory, product: product, quantity: 2)

  # Act & Assert
  expect {
    InventoryService.remove_stock(product, quantity: 5)
  }.to raise_error(InsufficientStockError)
end
```

## Key Takeaway

Rails testing is more convention-driven than Spring Boot. Use request specs (not controller specs), Factory Bot (not manual setup), and let Rails fixtures/transactions handle test isolation automatically.
