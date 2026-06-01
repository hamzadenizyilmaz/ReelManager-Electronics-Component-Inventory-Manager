# Activity Logs

## Purpose

Activity logs provide visibility into system operations and administrative actions.

## Logged Data

The system can log:

```txt
HTTP method
Localized method label
Path
Route
Status code
Localized status label
Duration ms
Query
Params
Body
User
IP
User agent
Origin
Referer
Request ID
Timestamp
```

## Sensitive Field Masking

The following fields are masked:

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

## Pages

```txt
/activity
/activity/:id
```

## Endpoints

```txt
GET /api/activity-logs
GET /api/activity-logs/:id
GET /api/activity-logs/summary
```

## Turkish Method Labels

```txt
GET    Okuma
POST   Oluşturma / İşlem
PUT    Güncelleme
PATCH  Kısmi Güncelleme
DELETE Silme
```

## Status Labels

```txt
200 Başarılı
201 Oluşturuldu
400 Geçersiz İstek
401 Yetkisiz
403 Yasak
404 Bulunamadı
500 Sunucu Hatası
```

## Admin Use Cases

- Investigate failed requests
- Check unauthorized attempts
- Review data changes
- Trace slow endpoints
- Audit user activity
