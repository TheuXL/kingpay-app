# Authentication Tests

This directory contains tests for the authentication endpoints, using the application's `authService` to interact with the Supabase backend.

## Testing Approach

The tests follow the principle of using the application services to communicate with the backend:

- Using `authService` for all authentication operations
- No direct HTTP calls to Supabase
- No hardcoded credentials in tests (using environment variables or test config)
- Using real API calls with proper error handling

## Tested Endpoints

1. **Login (token.test.js)**
   - **Service**: `authService.login()`
   - Tests authentication with valid and invalid credentials
   - Verifies the response structure (session, access_token, refresh_token, etc.)

2. **Login Duplicate (token-copy.test.js)**
   - **Service**: `authService.login()`
   - Same endpoint as the previous one, duplicated in the documentation
   - Identical tests to the first endpoint

3. **Registration (signup.test.js)**
   - **Service**: `authService.signup()`
   - Tests registration with an existing email (should fail)
   - Tests registration with a unique email (should create a user)

4. **Empty URL Endpoint (empty-url.test.js)**
   - Documentation for an endpoint listed without a URL
   - No actual test executed, just documents the existence of this endpoint in the documentation

## Response Structure

### Login (token)

```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6ImRDNDRxRzBlOStDMUVRYjQiLCJ0eXAiOiJKV1QifQ...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1752008150,
    "refresh_token": "xhpja3cgxbxr"
  },
  "user": {
    "id": "734bb2f1-ed63-4762-ae40-64809d4c13c3",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "test@example.com",
    "email_confirmed_at": "2025-05-25T21:27:00.356757Z",
    "phone": "",
    "confirmed_at": "2025-05-25T21:27:00.356757Z",
    "last_sign_in_at": "2025-07-08T19:55:50.340164322Z",
    "app_metadata": {
      "provider": "email",
      "providers": ["email"]
    },
    "user_metadata": {
      "email": "test@example.com",
      "email_verified": true,
      "phone_verified": false
    },
    "identities": [],
    "created_at": "2025-05-25T21:27:00.349509Z",
    "updated_at": "2025-07-08T19:55:50.342632Z"
  }
}
```

### Login Error (invalid credentials)

```json
{
  "error": {
    "message": "Invalid login credentials",
    "status": 400
  }
}
```

### Registration Error (existing email)

```json
{
  "error": {
    "message": "User already registered",
    "status": 422
  }
}
```

## Running the Tests

To run all authentication tests:

```bash
npm run test:auth
```

To run a specific test:

```bash
npm test -- "__tests__/Auth-Endpoints-1-4/token.test.js"
```

## Configuration

For these tests to work properly, you should set the following environment variables:

```
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-password
TEST_EXISTING_EMAIL=existing-user@example.com
```

If these environment variables are not set, the tests will use default values which will likely fail.

## Notes

- The tests use real API calls to the Supabase backend
- The registration test creates temporary users with unique emails
- The empty URL endpoint is documented but not tested due to lack of URL
- All tests properly handle and report errors rather than mocking responses 