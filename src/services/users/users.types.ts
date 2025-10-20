import { Type, Static } from "@sinclair/typebox";

/**
 * Repository insight schema
 */
export const RepoInsightSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  full_name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
});

export type RepoInsight = Static<typeof RepoInsightSchema>;

/**
 * User schema
 */
export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  userName: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String(), // In production, this would be hashed
  gitUserName: Type.Optional(Type.String()),
  repoInsights: Type.Optional(Type.Array(RepoInsightSchema)),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type User = Static<typeof UserSchema>;

/**
 * User creation schema (without id and timestamps)
 */
export const CreateUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  userName: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String({ minLength: 6 }),
});

export type CreateUser = Static<typeof CreateUserSchema>;

/**
 * User update schema
 */
export const UpdateUserSchema = Type.Partial(
  Type.Object({
    email: Type.String({ format: "email" }),
    userName: Type.String({ minLength: 3, maxLength: 50 }),
    password: Type.String({ minLength: 6 }),
    gitUserName: Type.String(),
    repoInsights: Type.Array(RepoInsightSchema),
  })
);

export type UpdateUser = Static<typeof UpdateUserSchema>;

/**
 * Patch user schema - for PATCH endpoint (userName and gitUserName only)
 */
export const PatchUserSchema = Type.Object({
  userName: Type.Optional(Type.String({ minLength: 3, maxLength: 50 })),
  gitUserName: Type.Optional(Type.String()),
});

export type PatchUser = Static<typeof PatchUserSchema>;

/**
 * Login schema
 */
export const LoginSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export type Login = Static<typeof LoginSchema>;

/**
 * Session schema
 */
export const SessionSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  token: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  expiresAt: Type.String({ format: "date-time" }),
});

export type Session = Static<typeof SessionSchema>;
