# MongoDB Atlas Setup

## Overview

This project now uses MongoDB with a small Node/Express API for auth and data access.

## Step 1: Create a MongoDB Atlas cluster

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user
4. Allow your IP address in Network Access

## Step 2: Get your connection string

Copy the Atlas connection string and update `.env`:

```env
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
```

## Step 3: Configure the backend

Set these variables in `.env`:

```env
JWT_SECRET="replace-with-a-long-random-string"
ADMIN_EMAILS="admin@example.com"
CLIENT_ORIGIN="http://localhost:8080"
PORT=4000
```

## Step 4: Run the API server

```bash
npm run dev:server
```

## Step 5: Run the frontend

```bash
npm run dev
```

The frontend uses a Vite proxy for `/api` in development.
