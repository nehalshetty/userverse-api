import { Type, Static } from "@sinclair/typebox";

/**
 * User schema
 */
export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  username: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String(), // In production, this would be hashed
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type User = Static<typeof UserSchema>;

/**
 * User creation schema (without id and timestamps)
 */
export const CreateUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  username: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String({ minLength: 6 }),
});

export type CreateUser = Static<typeof CreateUserSchema>;

/**
 * User update schema
 */
export const UpdateUserSchema = Type.Partial(
  Type.Object({
    email: Type.String({ format: "email" }),
    username: Type.String({ minLength: 3, maxLength: 50 }),
    password: Type.String({ minLength: 6 }),
  })
);

export type UpdateUser = Static<typeof UpdateUserSchema>;

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
