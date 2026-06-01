# Updates

## Overview

The `/updates` page checks GitHub releases and compares the installed version with the latest version.

## Endpoints

```txt
GET /api/updates/check
POST /api/updates/apply
```

## Environment Variables

```env
APP_VERSION="v2.2.0"
ALLOW_SYSTEM_UPDATE=false
GITHUB_REPOSITORY="hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"
```

## Safe Mode

By default, update execution is disabled.

```env
ALLOW_SYSTEM_UPDATE=false
```

In this mode, the system can check updates but cannot modify project files.

## Same-Version Protection

If installed version and latest version are the same:

- Update button is disabled
- Update action is blocked
- No files are changed
- No git command is executed

## Backup Before Update

Before update execution:

- Project files are copied
- SQL database backup is created
- Manifest is generated

## One-Time Info Panel

The update page shows explanatory information only once per browser.

This prevents repeated UI clutter for returning administrators.

## Recommended Admin Flow

1. Open `/updates`.
2. Check latest version.
3. If a new version exists, review release notes.
4. Make sure backups are available.
5. Enable update execution only if needed.
6. Apply update.
7. Verify backend and frontend.
