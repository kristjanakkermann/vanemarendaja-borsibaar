# Börsibaar Test Plan

**Project:** Börsibaar - Stock Exchange Bar POS System
**Team:** 36
**Version:** 1.0
**Date:** 2025-02-14

---

## 1. Testing Objectives

- Verify correctness of business logic in inventory management, sales processing, and price adjustments
- Ensure REST API endpoints return correct responses and status codes
- Validate authentication and authorization flows (OAuth2 + JWT)
- Confirm multi-tenant data isolation between organizations
- Detect regressions early through automated test suites
- Achieve minimum 70% code coverage on backend service and controller layers

## 2. Testing Levels

### 2.1 Unit Tests
- **Scope:** Service layer business logic
- **Framework:** JUnit 5 + Mockito
- **Approach:** Mock all dependencies (repositories, mappers) to test logic in isolation
- **Key areas:**
  - InventoryService: stock operations (add, remove, adjust), transaction creation, price calculations
  - ProductService: CRUD operations, category validation, deactivation
  - CategoryService: CRUD, organization-scoped uniqueness
  - SalesService: sale processing, revenue calculations
  - AuthService: OAuth2 user creation/lookup, JWT token generation
  - JwtService: token creation, validation, expiry

### 2.2 Integration Tests
- **Scope:** Controller layer (REST endpoints)
- **Framework:** Spring Boot Test + MockMvc + @SpringBootTest
- **Approach:** Full Spring context with mocked service beans, disabled security filters for endpoint testing
- **Key areas:**
  - All 9 controllers: request/response validation, HTTP status codes, content negotiation
  - Security filter chain: JWT authentication filter, protected vs public endpoints
  - Error handling: global exception handler, custom exception responses

### 2.3 System Tests (Manual)
- **Scope:** Full application flow via Docker Compose
- **Approach:** Manual testing of OAuth2 login, POS workflow, inventory management
- **Environment:** docker-compose.prod.yaml with PostgreSQL, NGINX reverse proxy

## 3. Test Scope

### 3.1 Backend - In Scope

| Component | Test Type | Coverage Target |
|-----------|-----------|----------------|
| InventoryService | Unit | All stock operations, edge cases (insufficient stock, inactive products, wrong org) |
| ProductService | Unit | CRUD, validation, deactivation |
| CategoryService | Unit | CRUD, organization scoping |
| SalesService | Unit | Sale processing, stats aggregation |
| AuthService | Unit | OAuth2 flow, user creation |
| JwtService | Unit | Token generation, validation |
| BarStationService | Unit | Station CRUD, organization scoping |
| OrganizationService | Unit | Organization CRUD |
| All Controllers | Integration | REST endpoints, status codes, request validation |
| JwtAuthenticationFilter | Unit | Token extraction, validation, context setup |

### 3.2 Backend - Out of Scope
- Database migration tests (Liquibase managed)
- External OAuth2 provider integration (Google)
- Performance and load testing

### 3.3 Frontend - In Scope
- Component rendering tests for key UI components
- API route handler tests (Next.js API routes)

### 3.4 Frontend - Out of Scope
- E2E browser tests (Playwright/Cypress)
- Visual regression testing

## 4. Test Approach

### 4.1 Test-Driven Development (TDD)
- New features: write failing test first, then implement
- Bug fixes: write test reproducing the bug, then fix

### 4.2 Regression Testing
- All existing tests run on every PR via CI/CD
- Backend: `./mvnw test`
- Frontend: `npm run lint` (test suite to be added)

### 4.3 Test Patterns
- **Arrange-Act-Assert (AAA):** Standard pattern for all test methods
- **Mock isolation:** Services tested with Mockito mocks for all dependencies
- **Controller testing:** @SpringBootTest with @AutoConfigureMockMvc, disabled security filters, mocked service layer
- **SecurityContext mocking:** UsernamePasswordAuthenticationToken with mock User entity

## 5. Test Environment

| Environment | Database | Configuration |
|-------------|----------|---------------|
| Local (unit tests) | None (mocked) | Mockito mocks |
| Local (integration tests) | H2 in-memory | spring-boot-starter-test |
| CI/CD (GitHub Actions) | H2 in-memory | Maven test phase |
| Production | PostgreSQL 17 | Docker Compose |

### 5.1 Test Dependencies
- **JUnit 5** - Test framework (via spring-boot-starter-test)
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing support
- **Spring Security Test** - Security testing utilities
- **H2 Database** - In-memory database for integration tests
- **MockMvc** - REST API testing without full server

## 6. Entry/Exit Criteria

### 6.1 Entry Criteria
- Code compiles without errors
- All dependencies resolved
- Test environment configured
- Test data prepared

### 6.2 Exit Criteria
- All planned test cases executed
- No critical or high-severity bugs open
- Minimum 70% code coverage on service layer
- All CI/CD pipeline tests passing
- Test report generated and reviewed

## 7. Roles & Responsibilities

| Role | Person | Responsibility |
|------|--------|---------------|
| Test Lead | Team 36 members | Test plan creation, test review |
| Backend Test Developer | Team 36 members | Unit and integration test implementation |
| Frontend Test Developer | Team 36 members | Component and API route tests |
| CI/CD Engineer | Team 36 members | Pipeline configuration, test automation |

## 8. Risks & Assumptions

### 8.1 Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| OAuth2 dependencies make auth tests complex | Medium | Mock OAuth2 providers, use Spring Security Test |
| Database state leaks between tests | High | Use @Transactional, H2 in-memory, fresh context per test class |
| Async operations in price correction job | Medium | Test scheduler in isolation, mock time dependencies |
| MapStruct mapper generation issues | Low | Compile-time validation, test mapper outputs |
| CORS/proxy issues not caught in tests | Medium | System-level testing with Docker Compose |

### 8.2 Assumptions
- H2 database behavior matches PostgreSQL for tested queries
- OAuth2 Google provider is stable and available
- CI/CD environment has sufficient resources for parallel test execution
- Test data in Liquibase seed scripts is representative

## 9. Test Deliverables

| Deliverable | Format | Location |
|-------------|--------|----------|
| Test Plan | Markdown | `docs/test-plan.md` |
| Backend Unit Tests | Java (JUnit 5) | `backend/src/test/java/com/borsibaar/service/` |
| Backend Integration Tests | Java (JUnit 5) | `backend/src/test/java/com/borsibaar/controller/` |
| Backend Config Tests | Java (JUnit 5) | `backend/src/test/java/com/borsibaar/config/` |
| Coverage Report | JaCoCo HTML | Generated by `./mvnw test` |
| CI/CD Test Results | GitHub Actions | `.github/workflows/docker-image.yml` |

## 10. Test Execution Summary

### 10.1 Backend Test Matrix

| Test Class | Tests | Status |
|------------|-------|--------|
| InventoryServiceTest | 11 | Implemented |
| ProductServiceTest | - | Implemented |
| CategoryServiceTest | - | Implemented |
| SalesServiceTest | - | Implemented |
| AuthServiceTest | - | Implemented |
| JwtServiceTest | - | Implemented |
| BarStationServiceTest | - | Implemented |
| OrganizationServiceTest | - | Implemented |
| ProductControllerTest | 8 | Implemented |
| InventoryControllerTest | - | Implemented |
| CategoryControllerTest | - | Implemented |
| SalesControllerTest | - | Implemented |
| AuthControllerTest | - | Implemented |
| AccountControllerTest | - | Implemented |
| BarStationControllerTest | - | Implemented |
| OrganizationControllerTest | - | Implemented |
| UserControllerTest | - | Implemented |
| JwtAuthenticationFilterTest | - | Implemented |
