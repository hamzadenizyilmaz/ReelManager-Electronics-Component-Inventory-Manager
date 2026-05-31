# Security Policy

## Supported Versions

| Version | Status |
| --- | --- |
| v2.1.x | Supported |
| v2.0.x | Limited fixes |
| v1.0.x | Unsupported |

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Report privately to the repository owner through GitHub contact options or a private channel.

Include:

- Affected version
- Reproduction steps
- Expected behavior
- Actual behavior
- Potential impact
- Suggested fix if available

## Security Notes

ReelManager uses:

- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS allowlist
- Rate limiting
- Request validation
- Prisma ORM
- Frontend middleware route guard

Production deployments should use:

- HTTPS
- Strong secrets
- Trusted database certificates
- Server-side API keys only
- Restricted CORS origins
- Secure infrastructure-level logging
