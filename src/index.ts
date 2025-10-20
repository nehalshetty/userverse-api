import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

// Import routes
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";

const app = new Koa();
const router = new Router();

// Middleware
app.use(bodyParser());

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status =
      err instanceof Error && "status" in err ? (err as any).status : 500;
    ctx.body = {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
    console.error("Error:", err);
  }
});

// Logging middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// Health check route
router.get("/health", (ctx) => {
  ctx.body = {
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  };
});

// Register routes
app.use(router.routes()).use(router.allowedMethods());
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(usersRoutes.routes()).use(usersRoutes.allowedMethods());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth`);
  console.log(`👥 Users endpoints: http://localhost:${PORT}/users`);
});

export default app;
