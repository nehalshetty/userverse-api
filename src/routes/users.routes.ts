import Router from "koa-router";
import { UsersService } from "../services/users/users.class";
import { success, error } from "../helpers/response";
import { authenticate } from "../helpers/auth-middleware";
import { PatchUserSchema, PatchUser } from "../services/users/users.types";
import { validate } from "../helpers/validator";
import { fetchGitHubRepos } from "../helpers/github";

const router = new Router({
  prefix: "/users",
});

// Initialize service
const usersService = new UsersService();

/**
 * GET /users
 * Get all users (requires authentication)
 */
router.get("/", async (ctx) => {
  try {
    const users = await usersService.findAll();
    // Remove passwords from response
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    success(ctx, sanitizedUsers);
  } catch (err) {
    error(
      ctx,
      err instanceof Error ? err.message : "Failed to fetch users",
      500
    );
  }
});

/**
 * GET /users/:id
 * Get a user by ID (requires authentication)
 */
router.get("/:id", authenticate, async (ctx) => {
  try {
    // Ensure users can only access their own data
    if (ctx.params.id !== ctx.state.userId) {
      error(ctx, "Forbidden", 403);
      return;
    }

    const user = await usersService.findById(ctx.params.id);
    if (!user) {
      error(ctx, "User not found", 404);
      return;
    }
    // Remove password from response
    const { password, ...sanitizedUser } = user;
    success(ctx, sanitizedUser);
  } catch (err) {
    error(
      ctx,
      err instanceof Error ? err.message : "Failed to fetch user",
      500
    );
  }
});

/**
 * PATCH /users/:id
 * Update user's userName and/or gitUserName (requires authentication)
 */
router.patch("/:id", authenticate, async (ctx) => {
  try {
    // Ensure users can only update their own data
    if (ctx.params.id !== ctx.state.userId) {
      error(ctx, "Forbidden", 403);
      return;
    }

    const data = validate<PatchUser>(PatchUserSchema, ctx.request.body);

    // Check if user exists
    const existingUser = await usersService.findById(ctx.params.id);
    if (!existingUser) {
      error(ctx, "User not found", 404);
      return;
    }

    // Prepare update data
    const updateData: any = {};

    // Update userName if provided
    if (data.userName) {
      // Check if userName is already taken by another user
      const userWithUsername = await usersService.findByUsername(data.userName);
      if (userWithUsername && userWithUsername.id !== ctx.params.id) {
        error(ctx, "Username already taken", 400);
        return;
      }
      updateData.userName = data.userName;
    }

    // Fetch GitHub repos if gitUserName is provided
    if (data.gitUserName) {
      try {
        const repoInsights = await fetchGitHubRepos(data.gitUserName);
        updateData.gitUserName = data.gitUserName;
        updateData.repoInsights = repoInsights;
      } catch (err) {
        error(
          ctx,
          err instanceof Error ? err.message : "Failed to fetch GitHub data",
          400
        );
        return;
      }
    }

    // Update user
    const updatedUser = await usersService.update(ctx.params.id, updateData);

    if (!updatedUser) {
      error(ctx, "Failed to update user", 500);
      return;
    }

    // Remove password from response
    const { password, ...sanitizedUser } = updatedUser;
    success(ctx, sanitizedUser);
  } catch (err) {
    error(
      ctx,
      err instanceof Error ? err.message : "Failed to update user",
      500
    );
  }
});

export default router;
