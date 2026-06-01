# Troubleshooting

## Prisma MySQL SSL Error

Error:

```txt
Connections using insecure transport are prohibited while --require_secure_transport=ON
```

Fix:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB?sslaccept=accept_invalid_certs"
```

For production, prefer proper CA certificates.

## Swagger Invalid Version Field

Make sure Swagger spec exports an object containing:

```js
openapi: "3.0.3"
```

and Express serves the correct object.

## Next.js Function Passed to Client Component

Error:

```txt
Functions cannot be passed directly to Client Components
```

Fix:

Do not pass `endpoints.categories` or other function objects as props from server components. Mark the page with `"use client"` or import API helpers directly in the client component.

## Dashboard 401 After Login

Cause:

Token was not saved under the key read by API interceptor.

Fix:

Ensure `lib/api.js` reads all token keys and sends:

```http
Authorization: Bearer <token>
```

## Activity Logs Route Callback Error

Error:

```txt
Route.get() requires a callback function but got undefined
```

Fix:

Check imported middleware/controller names. Use a safe auth middleware resolver or export the correct function.

## Frontend Build Cache

Clear `.next`:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

Linux/macOS:

```bash
rm -rf .next
```
