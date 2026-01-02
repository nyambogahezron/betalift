# Betalift Copilot Instructions

## Project Architecture

**Betalift** is a full-stack collaborative platform with two main applications:
- **Mobile**: React Native app (Expo, Zustand state management)
- **Server**: Node.js/Express API (TypeScript, MongoDB, JWT auth)

Key integration pattern: Mobile calls REST API (`/api/v1/*` endpoints) with Bearer token authentication. Both use TypeScript exclusively.

## Backend Architecture (Server)

### Directory Structure
- `src/config/` - Environment and constants
- `src/controllers/` - Business logic (auth, feedback, project, user, message, notification)
- `src/database/models/` - Mongoose schemas (User, Project, Feedback, Conversation, etc.)
- `src/middleware/` - Express middleware including auth, error handling, async wrapping
- `src/routes/api/v1/` - API routes organized by domain
- `src/services/` - Utilities (emailService)
- `src/utils/` - Helpers (JWT, logger, custom error classes)

### Error Handling Pattern
Uses custom error hierarchy (`ApiError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`, `ValidationError`). All async route handlers wrapped with `asyncHandler` middleware which catches errors and passes to `errorHandler`. Mongoose errors (ValidationError, CastError, duplicate keys 11000) are converted to HTTP responses in `errorHandler`.

### Authentication Flow
JWT-based with Bearer tokens in Authorization header. `authenticate` middleware verifies token, decodes payload, and verifies user exists in DB. Token payload includes `userId` and `email`. Attach `req.user` with type `AuthRequest.user` for typed access.

### Database Connection
Mongoose connects via `connectDatabase()` at server startup. Uses environment-specific MongoDB URI (`MONGODB_URI` for dev, `MONGODB_URI_TEST` for test). Test database automatically used when `NODE_ENV=test`.

### Environment Setup
All secrets in `.env`: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`, SMTP credentials, `CLIENT_URL` (mobile app origin). Server runs on `PORT` (default 5000). CORS configured to accept only `CLIENT_URL`.

## Mobile Architecture (React Native/Expo)

### State Management
Zustand stores with persistence: `useAuthStore` (user, login/logout), `useFeedbackStore` (feedback list), `useProjectStore` (projects). Stores persist to AsyncStorage using Zustand middleware.

### Navigation Structure
Expo Router file-based routing in `app/` directory. Main layout `_layout.tsx` initializes fonts and theme. Routes organized:
- `(auth)/` - Login/Register (unauthenticated)
- `(tabs)/` - Main app (explore, index, profile - authenticated)
- `project/` - Project CRUD
- `feedback/` - Feedback system
- `messages/` - Messaging
- `user/` - User profiles

### UI Component Convention
Reusable components in `components/ui/` (button, input, card, avatar, badge). Project-specific components in `components/project/` and `components/feedback/`. Export patterns use `index.ts` for barrel exports.

### API Integration Point
Mobile will implement API calls in `services/api.ts` (currently empty). Should use axios/fetch with base URL pointing to server (`ENV.clientUrl`). Authentication: attach JWT from `useAuthStore` as Bearer token in Authorization header.

## Development Workflow

### Backend (Server)
- **Start dev**: `npm run dev` in `apps/server/` (hot-reload with nodemon)
- **Build**: `npm run build` (compiles TypeScript to dist/)
- **Seed DB**: `npm run seed` to populate test data
- **Code style**: ESLint + Prettier configured per `eslint.config.js`
- **Import style**: TypeScript paths (check `tsconfig.json` for aliases)

### Frontend (Mobile)
- **Start dev**: `npm start` in `apps/mobile/` (Expo CLI)
- **iOS/Android**: `npm run ios` / `npm run android`
- **Lint**: `npm run lint` (Expo lint)
- **Code style**: ESLint + Prettier per mobile eslint config

### Testing
Server has no tests configured (`npm test` fails). Mobile has no test setup. Tests should be added before major feature releases.

## Key Patterns to Follow

### Backend
1. **Route handlers**: Use `asyncHandler(async (req: AuthRequest, res, next) => {})` for automatic error catching
2. **Validation**: Use `express-validator` in middleware before controller
3. **Responses**: Send JSON with `{ success: boolean, data: any, message?: string }`
4. **Database queries**: Mongoose chainable methods, always catch CastError for invalid IDs
5. **Email**: Use `emailService` (configured with SMTP_HOST, SMTP_USER, SMTP_PASSWORD)

### Frontend
1. **State updates**: Use Zustand actions; never mutate directly
2. **API calls**: Will integrate with `api.ts` service, include error boundaries
3. **Navigation**: Use `expo-router` Link component or `useRouter()` hook
4. **Icons**: Use `@expo/vector-icons` (preconfigured with Feather, MaterialCommunityIcons)

## Data Models (Key Entities)
- **User**: id, email, password (hashed), username, role, profile
- **Project**: id, title, description, owner, members (via ProjectMembership), status
- **Feedback**: id, title, description, projectId, authorId, status, votes/comments
- **Conversation**: id, participants, messages (via Message model)
- **Notification**: id, userId, type, read status, relatedEntity

## Critical Notes
- **JWT expiry**: Default 7 days access, 30 days refresh (configurable)
- **CORS**: Strict to `CLIENT_URL` only; requests without matching origin rejected
- **Passwords**: Hashed with bcryptjs before storage
- **File uploads**: Multer configured, max 10MB
- **Logging**: Winston logger in `utils/logger`; use `logger.info/warn/error` not console
- **Git workflow**: Fork + PR from feature branches to main; branch naming: `feature/*` or `fix/*`
