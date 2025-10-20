import { Context } from "koa";

/**
 * Send a success response
 */
export function success(ctx: Context, data: any, status: number = 200) {
  ctx.status = status;
  ctx.body = {
    success: true,
    data,
  };
}

/**
 * Send an error response
 */
export function error(ctx: Context, message: string, status: number = 400) {
  ctx.status = status;
  ctx.body = {
    success: false,
    error: message,
  };
}

/**
 * Send a created response
 */
export function created(ctx: Context, data: any) {
  success(ctx, data, 201);
}

/**
 * Send a no content response
 */
export function noContent(ctx: Context) {
  ctx.status = 204;
}
