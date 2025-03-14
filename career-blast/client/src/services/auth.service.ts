import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  fullName: string;
}

export const AuthService = {
  /**
   * Sign in a user with email and password
   */
  async signIn({ email, password }: UserCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, error: error as Error };
    }
  },

  /**
   * Sign up a new user with email, password, and optional metadata
   */
  async signUp({ email, password, fullName }: UserRegistration): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { user: null, error: error as Error };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error: error as Error };
    }
  },

  /**
   * Get the current user session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      return { session: data.session, error: null };
    } catch (error) {
      console.error('Error getting session:', error);
      return { session: null, error: error as Error };
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error getting current user:', error);
      return { user: null, error: error as Error };
    }
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(userData: { fullName?: string; email?: string }) {
    try {
      const { data: userResponse, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const updates = {
        id: userResponse.user.id,
        updated_at: new Date().toISOString(),
      } as Record<string, any>;

      // Use the passed userData parameter instead of the response
      if (userData.fullName) {
        updates.full_name = userData.fullName;
      }

      if (userData.email) {
        const { error } = await supabase.auth.updateUser({ email: userData.email });
        if (error) throw error;
      }

      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return { user: userResponse.user, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { user: null, error: error as Error };
    }
  },

  /**
   * Send a password reset email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as Error };
    }
  },

  /**
   * Update the user's password
   */
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error: error as Error };
    }
  },
};
