// src/services/authService.ts
import { supabase } from './supabase';

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: any;
  error?: any;
  session?: any;
}

/**
 * Service for managing authentication operations
 */
export const authService = {
  /**
   * Logs in a user
   * @param {string|object} emailOrParams - User's email or object with email and password
   * @param {string} [password] - User's password (optional if emailOrParams is an object)
   * @returns {Promise<object>} - Logged in user data
   */
  login: async (emailOrParams: any, password?: string) => {
    try {
      let email = '';
      let pass = '';
      
      // Check if parameters were passed as an object or separately
      if (typeof emailOrParams === 'object') {
        email = emailOrParams.email;
        pass = emailOrParams.password;
      } else {
        email = emailOrParams;
        pass = password || '';
      }
      
      // Check if Supabase client is available
      if (!supabase || !supabase.auth) {
        console.error("Supabase client not available");
        return { error: { message: "Authentication client not available" } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        console.error("Login error:", error.message);
        return { error };
      }

      console.log("Login successful for:", email);
      return data;
    } catch (error: any) {
      console.error("Authentication service error:", error.message);
      return { error };
    }
  },

  /**
   * Creates a new user account
   * Endpoint: POST https://{{base_url}}/auth/v1/signup
   */
  signup: async ({ email, password, name }: SignupParams): Promise<AuthResponse> => {
    try {
      // Check if Supabase client is available
      if (!supabase || !supabase.auth) {
        console.error("Supabase client not available");
        return { error: { message: "Authentication client not available" } };
      }
      
      // If there's a name, add it to the user metadata
      const options = name ? { data: { full_name: name } } : undefined;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: options ? { data: options.data } : undefined,
      });

      if (error) {
        console.error("Registration error:", error.message);
        return { error };
      }

      console.log("Registration successful for:", email);
      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
      };
    } catch (error: any) {
      console.error("Account creation error:", error.message || error);
      return { error };
    }
  },

  /**
   * Logs out the current user
   */
  logout: async (): Promise<{ error?: any }> => {
    try {
      // Check if Supabase client is available
      if (!supabase || !supabase.auth) {
        console.error("Supabase client not available");
        return { error: { message: "Authentication client not available" } };
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        return { error };
      }
      console.log("Logout successful");
      return {};
    } catch (error: any) {
      console.error("Logout error:", error.message || error);
      return { error };
    }
  },

  /**
   * Gets the current session
   */
  getSession: async () => {
    try {
      // Check if Supabase client is available
      if (!supabase || !supabase.auth) {
        console.error("Supabase client not available");
        return { error: { message: "Authentication client not available" } };
      }
      
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        return { error };
      }
      return {
        session: data.session,
        user: data.session?.user,
      };
    } catch (error: any) {
      console.error("Error getting session:", error.message || error);
      return { error };
    }
  },
  
  /**
   * Checks if the token is still valid
   */
  checkToken: async (): Promise<boolean> => {
    try {
      // Check if Supabase client is available
      if (!supabase || !supabase.auth) {
        console.error("Supabase client not available");
        return false;
      }
      
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Error checking token:", error);
      return false;
    }
  },
};