import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';

interface SessionContextType {
  session: Session | null;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
  isSessionExpired: boolean;
  sessionExpiresAt: Date | null;
  timeUntilExpiry: number | null; // in seconds
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  // Initialize session from Supabase
  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        updateExpiryInfo(data.session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          updateExpiryInfo(newSession);
        } else {
          setSessionExpiresAt(null);
          setTimeUntilExpiry(null);
          setIsSessionExpired(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check session expiry periodically
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (session) {
        updateExpiryInfo(session);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [session]);

  // Update session expiry information
  const updateExpiryInfo = (currentSession: Session) => {
    if (!currentSession?.expires_at) return;

    const expiryTimestamp = currentSession.expires_at;
    const expiryDate = new Date(expiryTimestamp * 1000);
    const now = new Date();
    
    setSessionExpiresAt(expiryDate);
    
    const timeLeft = Math.floor((expiryDate.getTime() - now.getTime()) / 1000);
    setTimeUntilExpiry(timeLeft > 0 ? timeLeft : 0);
    setIsSessionExpired(timeLeft <= 0);
    
    // If session is about to expire (less than 5 minutes), refresh it
    if (timeLeft > 0 && timeLeft < 300) {
      refreshSession();
    }
  };

  // Refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        updateExpiryInfo(data.session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  // Clear the session (logout)
  const clearSession = () => {
    supabase.auth.signOut().then(() => {
      setSession(null);
      setSessionExpiresAt(null);
      setTimeUntilExpiry(null);
      setIsSessionExpired(false);
    });
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        refreshSession,
        clearSession,
        isSessionExpired,
        sessionExpiresAt,
        timeUntilExpiry,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}; 