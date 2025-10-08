# BytePlus Client Test Suite

Comprehensive test suite for BytePlusClient and related components with 80%+ coverage.

## Overview

This test suite validates:
- BytePlusClient functionality
- Type definitions and constraints
- Error handling and retry logic
- Rate limiting
- Batch generation
- Network resilience

## Test Structure

```
tests/
├── unit/
│   ├── byteplus-client.test.ts  # Main client tests (400+ lines)
│   └── types.test.ts             # Type definition tests (100+ lines)
├── integration/
│   └── (placeholder for integration tests)
└── README.md                     # This file
```

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Type Checking

```bash
npm run typecheck
```

## Test Categories

### 1. BytePlusClient Tests (`byteplus-client.test.ts`)

#### Constructor & Configuration
- ✅ Valid configuration initialization
- ✅ Missing API key validation
- ✅ Missing endpoint validation
- ✅ Timeout range validation (1000ms - 300000ms)
- ✅ Retry attempts range validation (0-10)
- ✅ Default values for optional parameters

#### Image Generation
- ✅ SEEDDREAM model generation
- ✅ SEEDDREAM4 model generation
- ✅ Parameter validation (prompt, width, height, etc.)
- ✅ Default parameter handling
- ✅ Generation time tracking

#### Video Generation
- ✅ SEEDDANCE model generation
- ✅ Source image validation
- ✅ Duration validation (1-30 seconds)
- ✅ Quality level handling
- ✅ Dance style options

#### Error Handling
- ✅ 400 Bad Request
- ✅ 401 Unauthorized
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 429 Rate Limit
- ✅ 500 Internal Server Error
- ✅ Network errors
- ✅ Timeout errors
- ✅ Invalid JSON responses

#### Retry Logic & Exponential Backoff
- ✅ Retry on 429 rate limit
- ✅ Retry on 500+ server errors
- ✅ No retry on 4xx client errors
- ✅ Exponential backoff calculation (1s, 2s, 4s, 8s, max 10s)
- ✅ Max retries exhaustion

#### Rate Limiter
- ✅ Token bucket algorithm
- ✅ Usage tracking
- ✅ Window reset (1000ms)
- ✅ Statistics (used, available, resetIn)
- ✅ Automatic token replenishment

#### Batch Generation
- ✅ Multiple image generation
- ✅ Concurrency control (maxConcurrency)
- ✅ Partial failure handling
- ✅ Success rate calculation
- ✅ Shared parameters
- ✅ Empty prompts validation

#### Health Check
- ✅ API health verification
- ✅ Error handling

#### Debug Logging
- ✅ Debug mode enabled
- ✅ Debug mode disabled

### 2. Type Definition Tests (`types.test.ts`)

#### Core Types
- ✅ BytePlusConfig
- ✅ ImageStyle (7 styles)
- ✅ ImageGenerationModel
- ✅ ImageGenerationRequest
- ✅ ImageGenerationResponse
- ✅ VideoGenerationRequest
- ✅ VideoGenerationResponse
- ✅ APIErrorResponse

#### Supporting Types
- ✅ ImageDimensions
- ✅ ImageMetadata
- ✅ VideoMetadata
- ✅ RateLimiterConfig
- ✅ BatchGenerationRequest
- ✅ BatchGenerationResult
- ✅ QualityCheckResult

#### Type Consistency
- ✅ Request-response consistency
- ✅ Batch operation consistency
- ✅ Metadata matching

#### Numeric Ranges
- ✅ Dimensions (64-4096px)
- ✅ Guidance scale (1.0-20.0)
- ✅ Steps (10-100)
- ✅ Quality scores (0-100)

## Coverage Goals

Target: **80%+ coverage** across all metrics

| Metric     | Target | Description                        |
|------------|--------|------------------------------------|
| Lines      | 80%+   | Percentage of executed lines       |
| Functions  | 80%+   | Percentage of called functions     |
| Branches   | 80%+   | Percentage of executed branches    |
| Statements | 80%+   | Percentage of executed statements  |

### Viewing Coverage Report

After running `npm run test:coverage`, open:

```
coverage/index.html
```

## Test Technologies

- **Framework**: [Vitest](https://vitest.dev/) v3.2.4
- **Coverage**: [@vitest/coverage-v8](https://vitest.dev/guide/coverage) v3.2.4
- **Mocking**: `vi.mock()` and `vi.fn()`
- **Timers**: `vi.useFakeTimers()` for time-dependent tests

## Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BytePlusClient } from '../../src/api/byteplus-client.js';

describe('Feature Name', () => {
  let client: BytePlusClient;

  beforeEach(() => {
    // Setup before each test
    client = new BytePlusClient({
      apiKey: 'test-key',
      endpoint: 'https://test.com'
    });
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test input';

    // Act
    const result = client.someMethod(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Best Practices

1. **Use Descriptive Names**: Test names should clearly state what they test
2. **Follow AAA Pattern**: Arrange, Act, Assert
3. **Test Edge Cases**: Include boundary values and error conditions
4. **Mock External Dependencies**: Use `vi.fn()` for fetch and timers
5. **Keep Tests Isolated**: Each test should be independent
6. **Test One Thing**: Each test should verify one specific behavior

## Mocking Fetch

Example of mocking HTTP responses:

```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Success response
mockFetch.mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ imageUrl: 'https://example.com/image.png' })
});

// Error response
mockFetch.mockResolvedValue({
  ok: false,
  status: 400,
  json: async () => ({ code: 'BAD_REQUEST', message: 'Invalid input' })
});

// Network error
mockFetch.mockRejectedValue(new Error('Network error'));
```

## Debugging Tests

### Run Specific Test File

```bash
npm test byteplus-client.test.ts
```

### Run Specific Test Suite

```bash
npm test -- --grep "Rate Limiter"
```

### Run with Debug Output

```bash
npm test -- --reporter=verbose
```

### Enable Console Logs

Set `debug: true` in BytePlusConfig to see detailed logs.

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Manual workflow dispatch

CI requirements:
- All tests must pass
- Coverage must be ≥ 80%
- No TypeScript errors
- No ESLint errors

## Troubleshooting

### Tests Timeout

If tests timeout, check:
1. `vi.useFakeTimers()` is properly set up
2. `vi.advanceTimersByTimeAsync()` is called for time-dependent tests
3. Mock responses are properly configured

### Coverage Not Meeting Target

If coverage is below 80%:
1. Run `npm run test:coverage` to identify uncovered lines
2. Add tests for uncovered branches
3. Test error paths and edge cases
4. Ensure all public methods are tested

### Type Errors

If TypeScript errors occur:
1. Run `npm run typecheck` to identify issues
2. Ensure types are imported with `type` keyword:
   ```typescript
   import type { BytePlusConfig } from '../../src/types/byteplus.js';
   ```
3. Check that all type definitions match implementation

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Miyabi Framework](https://github.com/ShunsukeHayashi/Autonomous-Operations)
- [Project README](../README.md)

## Contact

For questions or issues with tests:
- Open an issue on GitHub
- Contact the development team

---

**Last Updated**: 2025-10-08
**Test Coverage**: 80%+ (target)
**Total Tests**: 100+ test cases
