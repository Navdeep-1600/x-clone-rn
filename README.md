# x-clone-rn

Mobile-first X/Twitter clone scaffold with a React Native app and a Node.js backend.

## Tech Stack

### Mobile

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router 6 for file-based routing
- React Navigation
- React Native Reanimated
- Expo Image

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Clerk for authentication
- Arcjet for protection/rate-limiting infrastructure
- Cloudinary for media storage
- `dotenv` for environment configuration
- `cors` for cross-origin requests

## Project Structure

```text
x-clone-rn/
├── backend/   # Express API
├── mobile/    # Expo React Native app
└── package.json
```

## Scripts

From the repo root:

```bash
npm run dev
npm run dev:backend
npm run dev:mobile
npm run start
npm run start:mobile
```

Inside `mobile/`:

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

Inside `backend/`:

```bash
npm run dev
npm run start
```

## Setup

1. Install dependencies in both apps:

```bash
cd backend && npm install
cd ../mobile && npm install
```

2. Create or update `backend/.env` with your own credentials.

3. Start the backend:

```bash
npm run dev:backend
```

4. Start the mobile app:

```bash
npm run dev:mobile
```

## Notes

- The backend `.env` file is ignored by git via [`backend/.gitignore`](/Users/max-dev/Desktop/Workspace/new/x-clone-rn/backend/.gitignore).
- If any real third-party keys were previously exposed outside local development, rotate them before using this project further.
