import { database } from "../../utils/database";
import { UsersService } from "../users/users.class";
import { Register, Login, AuthResponse } from "./auth.types";
import { AuthHooks, defaultAuthHooks } from "./auth.hooks";
import { Session } from "../users/users.types";
import crypto from "crypto";

/**
 * Auth Service Class
 * Handles authentication and authorization
 */
export class AuthService {
  private usersService: UsersService;
  private hooks: AuthHooks;

  constructor(usersService: UsersService, hooks?: AuthHooks) {
    this.usersService = usersService;
    this.hooks = { ...defaultAuthHooks, ...hooks };
  }

  /**
   * Generate a random token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Create a session for a user
   */
  private async createSession(userId: string): Promise<Session> {
    const token = this.generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session = database.sessions.insert({
      userId,
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }) as Session;

    return session;
  }

  /**
   * Register a new user
   */
  async register(data: Register): Promise<AuthResponse> {
    // Run before hook
    if (this.hooks.beforeRegister) {
      data = await this.hooks.beforeRegister(data);
    }

    // Check if user already exists
    const existingUserByEmail = await this.usersService.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const existingUserByUsername = await this.usersService.findByUsername(
      data.username
    );
    if (existingUserByUsername) {
      throw new Error("User with this username already exists");
    }

    // Create user
    const user = await this.usersService.create(data);

    // Create session
    const session = await this.createSession(user.id);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: session.token,
      expiresAt: session.expiresAt,
    };

    // Run after hook
    if (this.hooks.afterRegister) {
      return await this.hooks.afterRegister(response);
    }

    return response;
  }

  /**
   * Login a user
   */
  async login(data: Login): Promise<AuthResponse> {
    // Run before hook
    if (this.hooks.beforeLogin) {
      data = await this.hooks.beforeLogin(data);
    }

    // Verify credentials
    const user = await this.usersService.verifyCredentials(
      data.email,
      data.password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Create session
    const session = await this.createSession(user.id);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: session.token,
      expiresAt: session.expiresAt,
    };

    // Run after hook
    if (this.hooks.afterLogin) {
      return await this.hooks.afterLogin(response);
    }

    return response;
  }

  /**
   * Validate a session token
   */
  async validateToken(token: string): Promise<string | null> {
    const session = database.sessions.findOne((s: any) => s.token === token) as
      | Session
      | undefined;

    if (!session) return null;

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      database.sessions.delete(session.id);
      return null;
    }

    return session.userId;
  }

  /**
   * Logout (delete session)
   */
  async logout(token: string): Promise<boolean> {
    const session = database.sessions.findOne((s: any) => s.token === token) as
      | Session
      | undefined;

    if (!session) return false;

    return database.sessions.delete(session.id);
  }
}
