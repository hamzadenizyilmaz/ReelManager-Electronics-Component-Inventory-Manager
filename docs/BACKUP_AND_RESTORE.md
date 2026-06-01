# Backup and Restore

## Backup Types

ReelManager supports:

- JSON export
- SQL export
- Update backup
- Project file backup before update

## JSON Backup

Endpoint:

```txt
GET /api/settings/backup/export?format=json
```

## SQL Backup

Endpoint:

```txt
GET /api/settings/backup/export?format=sql
```

SQL backup is recommended before migrations and updates.

## Backup Before Update

Before applying a system update, ReelManager creates:

```txt
backups/update-YYYY-MM-DDTHH-MM-SS/
  project-files/
  database-backup.sql
  manifest.json
```

## Manifest

The manifest contains:

```txt
currentVersion
targetVersion
backupDate
projectBackupPath
databaseBackupPath
status
```

## Remote Transfer

Settings may include remote transfer configuration:

```txt
protocol: ftp or sftp
host
port
username
password
remotePath
```

Before testing connection, the system validates required fields.

## Restore Recommendation

To restore manually:

1. Stop backend and frontend.
2. Restore project files.
3. Restore SQL database.
4. Run Prisma generate.
5. Restart PM2 services.

Example SQL restore:

```bash
mysql -u reelmanager -p reelmanager < database-backup.sql
```
