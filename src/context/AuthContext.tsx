import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, HQRole } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currentRole: HQRole;
  setCurrentRole: (role: HQRole) => void;
  loginAsAdmin: (email?: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_ADMIN_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'commander@dhruva.org',

  full_name: 'Commander Admin',
  role: 'Operations Manager',
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_ADMIN_USER);
  const [currentRole, setCurrentRole] = useState<HQRole>('Operations Manager');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if live Supabase auth session exists
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'commander@polarcommand.org',
            full_name: session.user.user_metadata?.full_name || 'Commander Admin',
            role: currentRole,
            created_at: session.user.created_at,
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'commander@polarcommand.org',
            full_name: session.user.user_metadata?.full_name || 'Commander Admin',
            role: currentRole,
            created_at: session.user.created_at,
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentRole]);

  const loginAsAdmin = async (email = 'commander@polarcommand.org', password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.warn('Supabase auth sign-in warning:', error.message);
          // Fallback to local admin user session
          setUser(DEFAULT_ADMIN_USER);
        } else if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || 'Commander Admin',
            role: currentRole,
            created_at: data.user.created_at,
          });
        }
      } else {
        // Direct local HQ Admin authentication
        setUser({
          ...DEFAULT_ADMIN_USER,
          email,
        });
      }
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setUser(DEFAULT_ADMIN_USER);
      setIsLoading(false);
      return true;
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        currentRole,
        setCurrentRole,
        loginAsAdmin,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
