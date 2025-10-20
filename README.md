# Userverse API

A basic Node.js API built with Koa, Knex.js, TypeBox, and TypeScript.

## Features

- 🚀 **Koa** - Modern web framework for Node.js
- 📦 **TypeScript** - Type-safe development
- ✅ **TypeBox** - JSON Schema validation
- 🗄️ **In-Memory Store** - Mock database using Map
- 🔐 **Dummy Auth** - Basic authentication flow with login/register
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
│   ├── validator.ts          # TypeBox validation helper
│   └── response.ts           # Response helpers
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

- `GET /health` - Check API status

### Authentication

- `POST /auth/register` - Register a new user

  ```json
  {
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login a user

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/logout` - Logout a user (requires Bearer token)

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

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

## Notes

⚠️ **This is a development/demo setup:**

- Passwords are stored in plain text (use proper hashing in production)
- Tokens are random strings (use JWT in production)
- Data is stored in memory (use a real database in production)
- No input sanitization (add proper validation in production)
