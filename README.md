# Userverse API

A Node.js API built with Koa, TypeBox, and TypeScript featuring authentication and GitHub integration.

## Features

- 🚀 **Koa** - Modern web framework for Node.js
- 📦 **TypeScript** - Type-safe development
- ✅ **TypeBox** - JSON Schema validation with custom format validators
- 🗄️ **In-Memory Store** - Mock database using Map
- 🔐 **Authentication** - Token-based auth with session management
- 🔒 **Authorization** - Protected routes with Bearer token validation
- 🐙 **GitHub Integration** - Automatic repository fetching
- 📂 **Service Architecture** - Clean service structure with hooks

## Project Structure

```
src/
├── services/
│   ├── users/
│   │   ├── users.class.ts    # User service implementation
│   │   ├── users.hooks.ts    # User service hooks
│   │   └── users.types.ts    # User TypeBox schemas
│   └── auth/
│       ├── auth.class.ts     # Auth service implementation
│       ├── auth.hooks.ts     # Auth service hooks
│       └── auth.types.ts     # Auth TypeBox schemas
├── routes/
│   ├── auth.routes.ts        # Authentication endpoints
│   └── users.routes.ts       # User endpoints
├── utils/
│   ├── in-memory-store.ts    # In-memory data store
│   └── database.ts           # Database instance
├── helpers/
│   ├── validator.ts          # TypeBox validation helper (with format validators)
│   ├── response.ts           # Response helpers
│   ├── auth-middleware.ts    # Authentication middleware
│   └── github.ts             # GitHub API integration
└── index.ts                  # Application entry point
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run Production

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /health` - API health status

### Authentication (Public)

- `POST /auth/register` - Register new user (returns token)
- `POST /auth/login` - Login user (returns token)
- `POST /auth/logout` - Logout user (requires auth)

### Users (Protected - Requires Bearer Token)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID (own profile only)
- `PATCH /users/:id` - Update username and/or GitHub username (own profile only)
  - Updates `username` (optional)
  - Updates `gitUserName` (optional) - auto-fetches GitHub repos
  - Stores repos in `repoInsights` array with: id, name, full_name, description

## User Schema

```typescript
{
  id: string;
  email: string;
  username: string;
  password: string;
  gitUserName?: string;          // GitHub username
  repoInsights?: Array<{         // Auto-populated from GitHub API
    id: number;
    name: string;
    full_name: string;
    description: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

## Authentication

All protected endpoints require Bearer token in Authorization header:

```bash
Authorization: Bearer <token>
```

Get token from `/auth/register` or `/auth/login` response.

## Service Architecture

Each service follows this structure:

- **`.class.ts`** - Service implementation with business logic
- **`.hooks.ts`** - Lifecycle hooks (before/after operations)
- **`.types.ts`** - TypeBox schemas and types

### Hooks

Hooks allow you to run custom logic before/after service operations:

```typescript
const customHooks = {
  beforeCreate: async (data) => {
    // Custom logic before creation
    return data;
  },
  afterCreate: async (user) => {
    // Custom logic after creation
    return user;
  },
};

const usersService = new UsersService(customHooks);
```

## In-Memory Store

The app uses a simple Map-based in-memory store to mock a database. Data is stored in memory and will be lost when the server restarts.

## Quick Start Examples

Register and update profile with GitHub:

```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"myuser","password":"pass123"}'

# 2. Update with GitHub username (auto-fetches repos)
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gitUserName":"octocat"}'
```

See [EXAMPLES.md](./EXAMPLES.md) for detailed API usage.

## Notes

⚠️ **Development/Demo Setup:**

- Passwords stored in plain text (hash in production)
- Simple token-based auth (use JWT in production)
- In-memory storage (data lost on restart)
- GitHub API rate limits apply (60 requests/hour unauthenticated)
