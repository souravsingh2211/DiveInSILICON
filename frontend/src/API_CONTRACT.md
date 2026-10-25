# API the React frontend expects

Base path: `/api` (the Vite proxy forwards it to the backend; change with `VITE_API_URL`).
All bodies are JSON. Protected routes need the header `Authorization: Bearer <access_token>`.

## POST /api/auth/signup
Request:  `{ "name": "Asha", "email": "asha@college.ac.in", "password": "min 8 chars" }`
Success:  `{ "access_token": "<jwt>", "token_type": "bearer", "user": { "id": 1, "name": "Asha", "email": "asha@college.ac.in" } }`
Errors:   `409` email already used, `422` validation

## POST /api/auth/login
Request:  `{ "email": "...", "password": "..." }`
Success:  same shape as signup
Errors:   `401` wrong email or password

## POST /api/auth/google
Request:  `{ "access_token": "<Google OAuth access token>" }`
          (the backend should verify it with Google, check the audience is your client ID and the email is verified)
Success:  same shape as signup

## GET /api/auth/me   (protected)
Success:  `{ "id": 1, "name": "Asha", "email": "asha@college.ac.in" }`
Errors:   `401` token missing, invalid or expired

## Error format
Return FastAPI's default: `{ "detail": "Readable message" }` with the right HTTP status.
The frontend shows `detail` to the user as-is (for 422 it shows the first validation message).
