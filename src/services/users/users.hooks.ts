import { User, CreateUser } from "./users.types";

/**
 * Hooks for user service
 * These run before/after operations on the user service
 */

export interface UserHooks {
  beforeCreate?: (data: CreateUser) => Promise<CreateUser> | CreateUser;
  afterCreate?: (user: User) => Promise<User> | User;
  beforeUpdate?: (
    id: string,
    data: Partial<User>
  ) => Promise<Partial<User>> | Partial<User>;
  afterUpdate?: (user: User) => Promise<User> | User;
  beforeDelete?: (id: string) => Promise<void> | void;
  afterDelete?: (id: string) => Promise<void> | void;
}

/**
 * Default user hooks
 */
export const defaultUserHooks: UserHooks = {
  beforeCreate: async (data) => {
    console.log(`[Hook] Before creating user: ${data.email}`);
    return data;
  },
  afterCreate: async (user) => {
    console.log(`[Hook] After creating user: ${user.email} (ID: ${user.id})`);
    return user;
  },
  beforeUpdate: async (id, data) => {
    console.log(`[Hook] Before updating user: ${id}`);
    return data;
  },
  afterUpdate: async (user) => {
    console.log(`[Hook] After updating user: ${user.id}`);
    return user;
  },
  beforeDelete: async (id) => {
    console.log(`[Hook] Before deleting user: ${id}`);
  },
  afterDelete: async (id) => {
    console.log(`[Hook] After deleting user: ${id}`);
  },
};
