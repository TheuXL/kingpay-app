// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { session, error } = await authService.getSession();
      if (!error && session) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    // Escutar mudanças no estado de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        console.log('Estado de autenticação alterado:', _event);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn: async (email: string, password: string) => {
      setLoading(true);
      const response = await authService.login({ email, password });
      setLoading(false);
      return response;
    },
    signUp: async (email: string, password: string, name: string) => {
      setLoading(true);
      const response = await authService.signup({ 
        email, 
        password,
        name 
      });
      setLoading(false);
      return response;
    },
    signOut: async () => {
      setLoading(true);
      const response = await authService.logout();
      setLoading(false);
      return response;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};