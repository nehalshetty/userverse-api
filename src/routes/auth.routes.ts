import Router from "koa-router";
import { AuthService } from "../services/auth/auth.class";
import { UsersService } from "../services/users/users.class";
import {
  RegisterSchema,
  LoginSchema,
  Register,
  Login,
} from "../services/auth/auth.types";
import { validate } from "../helpers/validator";
import { success, error, created } from "../helpers/response";

const router = new Router({
  prefix: "/auth",
});

// Initialize services
const usersService = new UsersService();
const authService = new AuthService(usersService);

/**
 * POST /auth/register
 * Register a new user
 */
router.post("/register", async (ctx) => {
  try {
    const data = validate<Register>(RegisterSchema, ctx.request.body);
    const result = await authService.register(data);
    created(ctx, result);
  } catch (err) {
    error(ctx, err instanceof Error ? err.message : "Registration failed", 400);
  }
});

/**
 * POST /auth/login
 * Login a user
 */
router.post("/login", async (ctx) => {
  try {
    const data = validate<Login>(LoginSchema, ctx.request.body);
    const result = await authService.login(data);
    success(ctx, result);
  } catch (err) {
    error(ctx, err instanceof Error ? err.message : "Login failed", 401);
  }
});

/**
 * POST /auth/logout
 * Logout a user
 */
router.post("/logout", async (ctx) => {
  try {
    const token = ctx.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      error(ctx, "No token provided", 401);
      return;
    }

    await authService.logout(token);
    success(ctx, { message: "Logged out successfully" });
  } catch (err) {
    error(ctx, err instanceof Error ? err.message : "Logout failed", 400);
  }
});

export default router;
