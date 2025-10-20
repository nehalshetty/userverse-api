import { database } from "../../utils/database";
import { User, CreateUser, UpdateUser } from "./users.types";
import { UserHooks, defaultUserHooks } from "./users.hooks";

/**
 * User Service Class
 * Handles all user-related operations
 */
export class UsersService {
  private hooks: UserHooks;

  constructor(hooks?: UserHooks) {
    this.hooks = { ...defaultUserHooks, ...hooks };
  }

  /**
   * Create a new user
   */
  async create(data: CreateUser): Promise<User> {
    // Run before hook
    if (this.hooks.beforeCreate) {
      data = await this.hooks.beforeCreate(data);
    }

    const now = new Date().toISOString();
    const user = database.users.insert({
      ...data,
      createdAt: now,
      updatedAt: now,
    }) as User;

    // Run after hook
    if (this.hooks.afterCreate) {
      return await this.hooks.afterCreate(user);
    }

    return user;
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | undefined> {
    return database.users.findById(id) as User | undefined;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return database.users.findOne((user: any) => user.email === email) as
      | User
      | undefined;
  }

  /**
   * Find a user by username
   */
  async findByUsername(username: string): Promise<User | undefined> {
    return database.users.findOne((user: any) => user.username === username) as
      | User
      | undefined;
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return database.users.all() as User[];
  }

  /**
   * Update a user
   */
  async update(id: string, data: UpdateUser): Promise<User | undefined> {
    // Run before hook
    if (this.hooks.beforeUpdate) {
      data = await this.hooks.beforeUpdate(id, data);
    }

    const updatedUser = database.users.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    }) as User | undefined;

    // Run after hook
    if (updatedUser && this.hooks.afterUpdate) {
      return await this.hooks.afterUpdate(updatedUser);
    }

    return updatedUser;
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<boolean> {
    // Run before hook
    if (this.hooks.beforeDelete) {
      await this.hooks.beforeDelete(id);
    }

    const result = database.users.delete(id);

    // Run after hook
    if (result && this.hooks.afterDelete) {
      await this.hooks.afterDelete(id);
    }

    return result;
  }

  /**
   * Verify user credentials
   */
  async verifyCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    // In production, you would compare hashed passwords
    if (user.password === password) {
      return user;
    }

    return null;
  }
}
