# VitalCode Backend (RBAC Authentication)

Production-ready Node.js + Express + MongoDB authentication service with:

- RBAC roles: patient, doctor, pharmacy
- Signup, login, resend verification, and verify-email APIs
- JWT access token authentication
- Role-based authorization middleware
- Resend integration for email verification links
- Input validation and centralized error handling

## 1) Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

## 2) Required environment variables

Use `.env.example` as reference:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret for signing access tokens
- `JWT_EXPIRES_IN`: token lifetime (for example `1d`)
- `RESEND_API_KEY`: Resend API key (required in production)
- `RESEND_FROM_EMAIL`: verified sender email in Resend
- `APP_BASE_URL`: backend public URL used in verification links
- `FRONTEND_URL`: allowed CORS origin(s), comma-separated if multiple

## 3) Auth API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?email=<email>&token=<token>`
- `POST /api/auth/resend-verification`

## 4) Protected endpoints

- `GET /api/protected/me` (authenticated user)
- `GET /api/protected/doctor-only` (doctor role)
- `GET /api/protected/pharmacy-only` (pharmacy role)
- `GET /api/protected/patient-only` (patient role)

## 5) Security notes

- Passwords are hashed with bcrypt (salt rounds: 12)
- Login is blocked until email verification is complete
- Verification token is hashed in DB and expires after 30 minutes
- Auth and API routes are rate-limited
- Helmet, CORS, payload size limits, and consistent error responses are enabled
