// src/contexts/AuthContext.tsx
import { Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AppUser } from '../types/user';

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Get the session and user on component mount
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Check if we have a session saved in SecureStore
        const storedSession = await SecureStore.getItemAsync('supabase-session');
        
        if (storedSession) {
          const session = JSON.parse(storedSession);
          
          // Set the session and user if we have a valid session
          if (session?.access_token && session?.refresh_token) {
            const { data, error } = await supabase.auth.setSession(session);
            
            if (error) {
              console.error('Error setting session:', error);
              // Clear the stored session if it's invalid
              await SecureStore.deleteItemAsync('supabase-session');
            } else if (data?.session) {
              setState({
                user: data.session.user,
                session: data.session,
                loading: false,
                error: null,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      }
      
      setState(prev => ({ ...prev, loading: false }));
      
      // Set up auth state listener
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          // Save session to SecureStore
          await SecureStore.setItemAsync('supabase-session', JSON.stringify(session));
          
          setState({
            user: session.user,
            session,
            loading: false,
            error: null,
          });
        } else {
          // Clear session from SecureStore
          await SecureStore.deleteItemAsync('supabase-session');
          
          setState({
            user: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      });
      
      return () => {
        data.subscription.unsubscribe();
      };
    };
    
    getInitialSession();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message }));
        return { error };
      }
      
      return { error: undefined };
    } catch (error) {
      console.error('Error signing in:', error);
      setState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      return { error: new Error('An unexpected error occurred') };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message }));
        return { error };
      }
      
      return { error: undefined };
    } catch (error) {
      console.error('Error signing up:', error);
      setState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      return { error: new Error('An unexpected error occurred') };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // The auth state listener will update the state
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:8081/reset-password',
      });
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message }));
        return { error };
      }
      
      return { error: undefined };
    } catch (error) {
      console.error('Error resetting password:', error);
      setState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      return { error: new Error('An unexpected error occurred') };
    }
  };

  // The value object that will be available to consumers
  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};