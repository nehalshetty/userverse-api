# API Usage Examples

## Authentication Overview

All endpoints under `/users/*` require authentication via Bearer token.
Get the token from the `/auth/register` or `/auth/login` response.

```bash
# Include in all protected requests:
Authorization: Bearer <your_token_here>
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client.

---

## Public Endpoints (No Auth Required)

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T..."
  }
}
```

---

## Authentication Endpoints

### 2. Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "john@example.com",
      "username": "johndoe"
    },
    "token": "a1b2c3d4e5f6...",
    "expiresAt": "2025-10-21T12:00:00.000Z"
  }
}
```

**Save the token** - you'll need it for protected endpoints!

---

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "john@example.com",
      "username": "johndoe"
    },
    "token": "a1b2c3d4e5f6...",
    "expiresAt": "2025-10-21T12:00:00.000Z"
  }
}
```

---

### 4. Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Protected User Endpoints (Auth Required)

### 5. Get All Users

⚠️ **Requires Authentication**

```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "john@example.com",
      "username": "johndoe",
      "createdAt": "2025-10-20T...",
      "updatedAt": "2025-10-20T..."
    }
  ]
}
```

---

### 6. Get User by ID

⚠️ **Requires Authentication** - Can only access your own profile

```bash
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "john@example.com",
    "username": "johndoe",
    "createdAt": "2025-10-20T...",
    "updatedAt": "2025-10-20T..."
  }
}
```

**Error (trying to access another user's profile):**
```json
{
  "success": false,
  "error": "Forbidden"
}
```

---

### 7. Update User Profile (PATCH)

⚠️ **Requires Authentication** - Can only update your own profile

#### Update username only:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated"
  }'
```

#### Update with GitHub username (auto-fetches all repos):

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "gitUserName": "octocat"
  }'
```

#### Update both:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated",
    "gitUserName": "octocat"
  }'
```

**Response (with GitHub repos auto-populated):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "john@example.com",
    "username": "john_updated",
    "gitUserName": "octocat",
    "repoInsights": [
      {
        "id": 1296269,
        "name": "Hello-World",
        "full_name": "octocat/Hello-World",
        "description": "My first repository on GitHub!"
      },
      {
        "id": 1296270,
        "name": "Spoon-Knife",
        "full_name": "octocat/Spoon-Knife",
        "description": "This repo is for demonstration purposes only."
      }
    ],
    "createdAt": "2025-10-20T...",
    "updatedAt": "2025-10-20T..."
  }
}
```

**Error Responses:**

Username already taken:
```json
{
  "success": false,
  "error": "Username already taken"
}
```

GitHub user not found:
```json
{
  "success": false,
  "error": "GitHub user 'invalid-user' not found"
}
```

---

## Common Error Responses

### Authentication Required (401)
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Invalid/Expired Token (401)
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### Forbidden - Wrong User (403)
```json
{
  "success": false,
  "error": "Forbidden"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed: /email: Expected string to match 'email'"
}
```

---

---

## GitHub Integration Workflow

### Complete Example: Register → Update with GitHub Data

```bash
# Step 1: Register a new user
RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "username": "devuser",
    "password": "securepass123"
  }')

# Extract token and user ID from response
TOKEN=$(echo $RESPONSE | jq -r '.data.token')
USER_ID=$(echo $RESPONSE | jq -r '.data.user.id')

echo "Registered! Token: $TOKEN"
echo "User ID: $USER_ID"

# Step 2: Update profile with GitHub username
curl -X PATCH http://localhost:3000/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gitUserName": "torvalds"
  }'

# Step 3: View updated profile with all GitHub repos
curl http://localhost:3000/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### What Happens Behind the Scenes

When you provide a `gitUserName`:

1. **Validation** - Checks if you're authenticated and updating your own profile
2. **GitHub API Call** - Fetches all repositories from `https://api.github.com/users/{gitUserName}/repos`
3. **Data Mapping** - Extracts: `id`, `name`, `full_name`, `description` from each repo
4. **Storage** - Saves both `gitUserName` and `repoInsights` array to your user profile
5. **Response** - Returns updated user data with all repositories

**Note:** GitHub API rate limit is 60 requests/hour for unauthenticated requests.

---

## Service Usage Examples

### Using the UsersService directly

```typescript
import { UsersService } from "./services/users/users.class";

const usersService = new UsersService();

// Create a user
const user = await usersService.create({
  email: "jane@example.com",
  username: "janedoe",
  password: "password123",
});

// Find by email
const foundUser = await usersService.findByEmail("jane@example.com");

// Update user
await usersService.update(user.id, {
  username: "jane_doe_updated",
});

// Delete user
await usersService.delete(user.id);
```

### Using Custom Hooks

```typescript
import { UsersService } from "./services/users/users.class";

const customHooks = {
  beforeCreate: async (data) => {
    // Hash password before saving
    console.log("Custom: Hashing password...");
    return data;
  },
  afterCreate: async (user) => {
    // Send welcome email
    console.log(`Custom: Sending welcome email to ${user.email}`);
    return user;
  },
};

const usersService = new UsersService(customHooks);
```

### Using the AuthService

```typescript
import { AuthService } from "./services/auth/auth.class";
import { UsersService } from "./services/users/users.class";

const usersService = new UsersService();
const authService = new AuthService(usersService);

// Register
const registerResult = await authService.register({
  email: "bob@example.com",
  userName: "bobsmith",
  password: "securepass",
});

console.log("Token:", registerResult.token);

// Login
const loginResult = await authService.login({
  email: "bob@example.com",
  password: "securepass",
});

// Validate token
const userId = await authService.validateToken(loginResult.token);
console.log("User ID:", userId);

// Logout
await authService.logout(loginResult.token);
```

## TypeBox Validation Examples

```typescript
import { validate } from "./helpers/validator";
import { CreateUserSchema } from "./services/users/users.types";

// Valid data
const validData = {
  email: "test@example.com",
  userName: "testuser",
  password: "password123",
};

const user = validate(CreateUserSchema, validData); // Success

// Invalid data
const invalidData = {
  email: "not-an-email",
  userName: "ab", // too short
  password: "123", // too short
};

try {
  validate(CreateUserSchema, invalidData);
} catch (error) {
  console.error(error.message); // Validation failed: ...
}
```
