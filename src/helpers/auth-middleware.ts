import { Context, Next } from "koa";
import { AuthService } from "../services/auth/auth.class";
import { UsersService } from "../services/users/users.class";
import { error } from "../helpers/response";

// Initialize services for auth validation
const usersService = new UsersService();
const authService = new AuthService(usersService);

/**
 * Authentication middleware
 * Validates the Bearer token and attaches userId to context state
 */
export async function authenticate(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      error(ctx, "Authentication required", 401);
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const userId = await authService.validateToken(token);

    if (!userId) {
      error(ctx, "Invalid or expired token", 401);
      return;
    }

    // Attach userId to context state for use in routes
    ctx.state.userId = userId;

    await next();
  } catch (err) {
    error(
      ctx,
      err instanceof Error ? err.message : "Authentication failed",
      401
    );
  }
}
