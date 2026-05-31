# Security Notes

## Authentication

The application uses JWT authentication.

Frontend stores token in:

- `localStorage` for client requests
- SameSite cookie for Next middleware route protection

Backend validates token using JWT middleware.

## Frontend Guard

Protected routes are configured in `frontend/middleware.js`.

The API client in `frontend/lib/api.js` automatically attaches:

```text
Authorization: Bearer TOKEN
```

If API returns `401`, the session is cleared and the user is redirected to login.

## Backend Guard

Protected routes must use backend auth middleware. Frontend checks are not enough for real security.

## Production Hardening

- Use HTTPS only.
- Use a strong `JWT_SECRET`.
- Replace default admin password.
- Use trusted MySQL certificates.
- Restrict CORS to production frontend URL.
- Store provider API keys only in backend `.env`.
- Keep logs free of secrets and tokens.
