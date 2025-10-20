import { Type, Static } from "@sinclair/typebox";

/**
 * Register request schema
 */
export const RegisterSchema = Type.Object({
  email: Type.String({ format: "email" }),
  userName: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String({ minLength: 6 }),
});

export type Register = Static<typeof RegisterSchema>;

/**
 * Login request schema
 */
export const LoginSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export type Login = Static<typeof LoginSchema>;

/**
 * Auth response schema
 */
export const AuthResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.String(),
    email: Type.String(),
    userName: Type.String(),
    gitUserName: Type.Optional(Type.String()),
    repoInsights: Type.Optional(Type.Array(Type.Any())),
  }),
  token: Type.String(),
  expiresAt: Type.String({ format: "date-time" }),
});

export type AuthResponse = Static<typeof AuthResponseSchema>;
