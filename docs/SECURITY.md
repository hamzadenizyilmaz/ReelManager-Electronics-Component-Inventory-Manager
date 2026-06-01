# Security Documentation

## Authentication

ReelManager uses JWT-based authentication.

Protected API calls require:

```http
Authorization: Bearer <token>
```

## Authorization

Recommended roles:

```txt
admin
user
viewer
```

Critical sections should be restricted to administrators:

- Settings
- Users
- Backup
- Updates
- Activity logs
- API credentials

## Password Storage

Passwords must be hashed with bcrypt or a comparable secure hashing method.

Never store plaintext passwords.

## Sensitive Data

The following values should never be exposed publicly:

```txt
JWT_SECRET
DATABASE_URL
NEXAR_CLIENT_SECRET
DIGIKEY_CLIENT_SECRET
MOUSER_API_KEY
FTP/SFTP passwords
```

## Logging Security

Activity logs mask sensitive fields such as:

```txt
password
token
secret
apiKey
authorization
clientSecret
accessToken
refreshToken
```

## Update Security

Update execution is disabled by default.

```env
ALLOW_SYSTEM_UPDATE=false
```

Only enable it when you fully understand the update workflow.

## Backup Security

Backup files may contain sensitive data. Store them securely and avoid exposing the backup directory publicly.

## Production Recommendations

- Use HTTPS.
- Use strong JWT secret.
- Use a restricted database user.
- Restrict admin routes.
- Keep `.env` files private.
- Disable system update execution unless needed.
- Regularly review activity logs.
