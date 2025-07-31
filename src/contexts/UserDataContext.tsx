import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Company, UserProfile, userProfileService } from '../features/authentication/services/userProfileService';
import { useAppContext } from './AppContext';

interface UserDataContextType {
  userProfile: UserProfile | null;
  company: Company | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { profile, company } = (await userProfileService.getUserProfileAndCompany(user.id)) || {};
      setUserProfile(profile || null);
      setCompany(company || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserProfile(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Dependência estável

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setCompany(null);
      setLoading(false);
    }
  }, [user?.id, fetchUserProfile]);

  return (
    <UserDataContext.Provider value={{ userProfile, company, loading, fetchUserProfile }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 