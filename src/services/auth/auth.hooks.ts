import { Register, Login, AuthResponse } from "./auth.types";

/**
 * Hooks for auth service
 */
export interface AuthHooks {
  beforeRegister?: (data: Register) => Promise<Register> | Register;
  afterRegister?: (
    response: AuthResponse
  ) => Promise<AuthResponse> | AuthResponse;
  beforeLogin?: (data: Login) => Promise<Login> | Login;
  afterLogin?: (response: AuthResponse) => Promise<AuthResponse> | AuthResponse;
}

/**
 * Default auth hooks
 * Currently just logs the operations
 */
export const defaultAuthHooks: AuthHooks = {
  beforeRegister: async (data) => {
    console.log(`[Hook] Before register: ${data.email}`);
    return data;
  },
  afterRegister: async (response) => {
    console.log(`[Hook] After register: ${response.user.email}`);
    return response;
  },
  beforeLogin: async (data) => {
    console.log(`[Hook] Before login: ${data.email}`);
    return data;
  },
  afterLogin: async (response) => {
    console.log(`[Hook] After login: ${response.user.email}`);
    return response;
  },
};
