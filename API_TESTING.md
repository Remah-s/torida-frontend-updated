# API Integration Testing Guide

This document explains how to test and validate all API integrations against the TORIDA backend.

## Overview

The testing infrastructure includes:

1. **API Health Check** (`src/utils/apiHealth.ts`) - Validates backend availability on startup
2. **API Test Suite** (`src/utils/apiTests.ts`) - Comprehensive endpoint testing
3. **Test UI Page** (`src/pages/ApiTestPage.tsx`) - Interactive test runner and results dashboard

## Testing Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/governorates` - List all governorates
- `GET /api/user-types` - List all user types
- `GET /api/categories` - List all categories
- `GET /api/products?page=1&per_page=10` - List products with pagination

### Protected Endpoints (Authentication Required)

- `GET /api/auth/me` - Get current authenticated user
- `GET /api/users/:id` - Get specific user profile
- `GET /api/cart` - Get user's shopping cart
- `GET /api/wishlist?page=1&per_page=10` - Get user's wishlist
- `GET /api/orders?page=1&per_page=10` - Get user's orders
- `GET /api/notifications?page=1&per_page=10` - Get user's notifications

## Running Tests

### Option 1: Automatic Health Check (On App Startup)

The health check runs automatically when the app starts:

```typescript
// In src/App.tsx AuthWrapper component
useEffect(() => {
  if (isInitialized) {
    checkApiHealth().catch((err) => {
      console.error('[App] Health check failed:', err);
    });
  }
}, [isInitialized]);
```

Check the browser console for health check results:

```
[API Health] Starting health check for https://torida-v2.vercel.app...
[API Health] ✓ Backend health check passed
[API Health] ✓ Public API endpoint accessible
[API Health] Health check complete { healthy: true, errors: [], warnings: [] }
```

### Option 2: Manual Testing via UI

1. **In Development Mode**, visit: `http://localhost:5173/dev/api-tests`

2. The test page provides:
   - **Run All Tests** - Tests all public and protected endpoints
   - **Test Auth** - Tests authentication flow
   - **Test Interceptors** - Validates request/response interceptor setup
   - **Test Response Format** - Validates API response format
   - **Clear Results** - Clears test results
   - **Export JSON** - Downloads test results as JSON

3. Results display as:
   - **Summary**: Total, Passed, Failed, Skipped counts with success rate
   - **Detailed Results**: Individual endpoint results with response times
   - **Console Output**: Real-time test execution logs

### Option 3: Programmatic Testing

Run tests from the browser console or custom scripts:

```typescript
import { runApiTests, testInterceptors, testResponseParsing } from '@/utils/apiTests';

// Run all tests
const results = await runApiTests();
console.log(results);

// Test specific functionality
await testInterceptors();
await testResponseParsing();
```

## Test Results Interpretation

### Status Codes

- **PASS** ✓ - Endpoint tested successfully
- **FAIL** ✗ - Endpoint test failed (error in response)
- **WARN** ⚠ - Endpoint returned unexpected status but not critical
- **SKIP** ⊘ - Endpoint skipped (requires auth but no token available)

### Common Issues

#### 401 Unauthorized

**Cause**: Protected endpoint requires authentication token

**Solution**: 
1. Login to the app first
2. Run tests again after authentication

**Token Storage**: Access token stored at `localStorage.torida_access_token`

#### 404 Not Found

**Cause**: Endpoint doesn't exist on backend

**Solution**:
1. Verify endpoint exists in backend API documentation
2. Check if backend URL is correct (should be `https://torida-v2.vercel.app`)
3. Verify API service imports use centralized base URL

#### Network Errors

**Cause**: Cannot reach backend or CORS issues

**Solution**:
1. Check if backend is deployed and running
2. Verify network connectivity
3. Check browser console for CORS headers errors
4. Ensure base URL in `src/constants/index.ts` is correct

## API Response Format

All API responses follow this format:

```typescript
{
  success: boolean;           // Whether request succeeded
  message?: string;          // Optional message
  data: T;                   // Response data (generic type)
  pagination?: {             // For paginated endpoints
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  errors?: Record<string, string[]>;  // Validation errors
}
```

## Debugging

### Enable Detailed Logging

The test suite logs detailed information to the console:

```typescript
// View in browser DevTools → Console tab
[API Health] Starting health check...
[Test] ✓ GET /api/governorates - OK (145ms)
[API Error] Endpoint failed with detailed context
```

### Export Test Results

Click "Export JSON" to download detailed test results:

```json
{
  "timestamp": "2024-01-20T10:30:45.123Z",
  "healthStatus": {
    "healthy": true,
    "baseUrl": "https://torida-v2.vercel.app",
    "errors": [],
    "warnings": []
  },
  "testResults": [
    {
      "endpoint": "GET /api/governorates",
      "method": "GET",
      "status": "PASS",
      "message": "OK",
      "responseTime": 145
    }
  ],
  "logs": [...]
}
```

## Configuration

### Environment Variables

Set in `.env`:

```env
VITE_API_BASE_URL=https://torida-v2.vercel.app
```

Fallback configured in `src/constants/index.ts`:

```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || BASE_URL,
};

export const BASE_URL = 'https://torida-v2.vercel.app';
```

### Customizing Test Endpoints

Edit `src/utils/apiTests.ts` to add new endpoints:

```typescript
await testEndpoint('GET /api/custom-endpoint', () =>
  api.get<any>('/custom-endpoint')
);
```

## Interceptors

The API layer includes automatic interceptors:

### Request Interceptor

- Attaches Bearer token from localStorage
- Normalizes URLs (adds `/api` prefix if needed)
- Sets `Content-Type: application/json` header

### Response Interceptor

- Unwraps API response structure
- Handles 401 Unauthorized (token refresh)
- Normalizes error messages
- Provides specific errors for common HTTP status codes

## Best Practices

1. **Test After Deployment** - Run full test suite after deploying backend updates
2. **Check Health Regularly** - Monitor health check results in browser console
3. **Validate Before Release** - Ensure all critical endpoints pass before production
4. **Export Results** - Keep JSON exports for regression testing
5. **Clear Cache** - Hard refresh (Ctrl+Shift+R) if getting stale responses

## Troubleshooting

### Tests Showing Stale Data

**Solution**: Clear browser cache and localStorage

```javascript
localStorage.clear();
sessionStorage.clear();
// Then hard refresh: Ctrl+Shift+R
```

### Token Not Persisting

**Check**:
- Open DevTools → Application → Local Storage
- Verify `torida_access_token` exists
- Check token expiration timestamp
- Token format should be: `Bearer <jwt>`

### Mixed Content Errors

**Fix**: Ensure `https://` URLs are used consistently

```typescript
// WRONG
const url = 'http://torida-v2.vercel.app/api';

// CORRECT
const url = 'https://torida-v2.vercel.app/api';
```

## Production Considerations

### Test Page Only Available in Development

The test page (`/dev/api-tests`) is only accessible during development:

```typescript
{import.meta.env.DEV && (
  <Route path="/dev/api-tests" element={<ApiTestPage />} />
)}
```

This prevents exposing test utilities in production builds.

### Health Check Runs Always

Health check runs on app startup regardless of environment:

- **Development**: Full diagnostic output
- **Production**: Errors logged to console, warnings suppressed

### Monitoring in Production

For production monitoring, consider:

1. Adding server-side API health monitoring
2. Implementing error boundary for graceful failure handling
3. Using analytics to track API error rates
4. Setting up alerts for repeated failures

## Related Files

- **API Service**: `src/services/api.ts`
- **Constants**: `src/constants/index.ts`
- **Auth Store**: `src/stores/authStore.ts`
- **Hooks**: `src/hooks/useApi.ts`

## Support

For issues or questions:

1. Check browser console for error details
2. Review test results JSON export
3. Verify backend deployment status
4. Check network tab in DevTools for actual HTTP requests
5. Review API documentation at backend repository
