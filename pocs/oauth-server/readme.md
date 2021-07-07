## OAuth Server Backend

#### process.env variables required:
- PORT=
- DB_USER=
- DB_PASS=
- EMAIL_USER=
- EMAIL_PASS=
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=
- SECRET_COOKIE=

Mail details must be mail.com

#### Current API functionality

| Path | Variables | Method |
|---|---|---|
|/account/registration|method: String <br> consent: Boolean|POST|


#### GDPR Related

- Personal information stored: Google Profile ID
- Required cookies: passport auth token