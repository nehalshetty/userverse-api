import Router from "koa-router";
import { UsersService } from "../services/users/users.class";
import { success, error } from "../helpers/response";

const router = new Router({
  prefix: "/users",
});

// Initialize service
const usersService = new UsersService();

/**
 * GET /users
 * Get all users
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
 * Get a user by ID
 */
router.get("/:id", async (ctx) => {
  try {
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

export default router;
