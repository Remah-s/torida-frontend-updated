# Quick Start: API Testing

Get up and running with API integration tests in 5 minutes.

## 1. Start Development Server

```bash
npm run dev
```

Expected output:
```
VITE v8.0.10 ready in 123 ms

➜  Local:   http://localhost:5173/
```

## 2. Check Console for Health Check

Open DevTools (F12) → Console tab

Look for:
```
[API Health] Starting health check for https://torida-v2.vercel.app...
[API Health] ✓ Backend health check passed
[API Health] ✓ Public API endpoint accessible
[API Health] Health check complete { healthy: true, errors: [], warnings: [] }
```

✅ **Green checkmarks mean backend is online**

## 3. Access Test Dashboard

Open in browser: **http://localhost:5173/dev/api-tests**

You should see:
- Test Controls Panel (buttons at top)
- Health Status card
- Ready to run tests

## 4. Run Tests

### Without Login (Test Public Endpoints)

Click **"Run All Tests"** button

Results show:
- ✓ Governorates, Categories, User Types, Products (all PASS)
- ⊘ Cart, Orders, Notifications (all SKIP - require login)

### With Login (Full Testing)

1. Click back arrow → Go home
2. Click "Login" → Enter valid credentials
3. Return to **http://localhost:5173/dev/api-tests**
4. Click **"Run All Tests"** again

Results now show:
- ✓ All public endpoints (PASS)
- ✓ All protected endpoints (PASS if authenticated)

## 5. Understanding Results

| Status | Icon | Meaning |
|--------|------|---------|
| PASS | ✓ | Endpoint works correctly |
| FAIL | ✗ | Error response or network issue |
| WARN | ⚠ | Unexpected response format |
| SKIP | ⊘ | Requires auth - please login |

**Success Rate** = PASS count / Total count × 100%

## 6. Export Results

Click **"Export JSON"** to download test results

Useful for:
- Regression testing
- Comparing before/after backend changes
- Debugging failures
- Documentation

## 7. Additional Tests

Once main tests pass, try:

- **Test Auth** - Check authentication flow
- **Test Interceptors** - Verify request/response handling
- **Test Response Format** - Validate API response structure

## Troubleshooting

### Tests Show 401 Unauthorized

**Problem**: Protected endpoint tests are skipping

**Solution**:
1. Go to app home page (click back arrow)
2. Click "Login" 
3. Enter valid credentials
4. Return to test page and re-run tests

### Tests Show 404 Not Found

**Problem**: Endpoint doesn't exist on backend

**Possible causes**:
- Backend endpoint naming changed
- Base URL incorrect
- Endpoint not implemented yet

**Check**:
1. View Network tab in DevTools
2. Look at actual URL being requested
3. Verify it matches backend API docs

### Network Errors / Cannot Reach Backend

**Problem**: "Network Error" or "ENOTFOUND"

**Causes**:
- Backend is down
- No internet connectivity
- Wrong base URL

**Verify**:
1. Check backend is deployed: https://torida-v2.vercel.app
2. Check internet connection
3. View console logs for base URL being used

### Test Page Returns 404

**Problem**: `/dev/api-tests` route not found

**Solution**: 
- Test page only works in **development mode**
- Run: `npm run dev` not `npm run build`

## File Locations

Key files for testing:

- **Health Check**: `src/utils/apiHealth.ts`
- **Test Suite**: `src/utils/apiTests.ts`
- **Test UI**: `src/pages/ApiTestPage.tsx`
- **App Integration**: `src/App.tsx` (AuthWrapper)
- **Documentation**: `API_TESTING.md`, `API_TESTING_SUMMARY.md`

## Environment Config

Backend URL is configured in:

**`src/constants/index.ts`**:
```typescript
export const BASE_URL = 'https://torida-v2.vercel.app';
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || BASE_URL,
};
```

To change URL:
1. Create/update `.env` file
2. Add: `VITE_API_BASE_URL=your-url-here`
3. Restart dev server

## What Gets Tested

### Public (No Auth Required)
- ✓ Get all governorates
- ✓ Get all user types
- ✓ Get all categories
- ✓ Get products with pagination

### Protected (Auth Required)
- ✓ Get current user profile
- ✓ Get specific user details
- ✓ Get shopping cart
- ✓ Get wishlist
- ✓ Get orders
- ✓ Get notifications

## Next Steps

1. **Verify all tests pass** ✓
2. **Note any failures** and document them
3. **Export JSON results** as baseline
4. **Before each backend update**: Re-run tests to catch breakage
5. **Share results** with team for regression testing

## Support

Having issues? Check:

1. **Browser console** (F12) - Look for error messages
2. **Network tab** (F12 → Network) - See actual requests/responses
3. **API_TESTING.md** - Full documentation
4. **API_TESTING_SUMMARY.md** - Implementation details

---

**Happy Testing! 🚀**

For issues accessing test page: Ensure you're using `npm run dev` (development mode)
