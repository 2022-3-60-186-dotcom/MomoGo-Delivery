# Cloud Database Integration Summary

## Status: MongoDB Enabled

Your Momogo Delivery project now uses MongoDB (Atlas or local) with a Node/Express API. Authentication is handled with JWT cookies.

## What's Included

- MongoDB connection with Mongoose models
- Auth endpoints for sign up, sign in, and session check
- Password reset token storage (token is logged to the server console)
- Frontend API helper using `fetch` with cookies

## Quick Start

1. Configure `.env` (see [CLOUD_DATABASE_SETUP.md](./CLOUD_DATABASE_SETUP.md))
2. Start the API server: `npm run dev:server`
3. Start the frontend: `npm run dev`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Admin Accounts

Use `ADMIN_EMAILS` in `.env` to auto-assign the admin role for matching emails.

## Notes

- The frontend uses a Vite proxy for `/api` in development.
- The reset password flow logs a reset link to the backend console for now.

## Resources

- https://www.mongodb.com/docs/
- https://mongoosejs.com/docs/
