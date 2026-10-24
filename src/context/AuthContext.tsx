'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CivicUser,
  UserRole,
  AuthSession,
  getStoredSession,
  saveSession,
  clearSession,
  authenticateUser,
  registerUser,
  createPasswordResetToken,
  resetPasswordWithToken,
  DEFAULT_DEMO_ACCOUNTS,
} from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: CivicUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  authMode: 'SUPABASE_CLOUD' | 'SECURE_CRYPTO_LOCAL';
  login: (email: string, password: string) => Promise<CivicUser>;
  signup: (params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    adminInviteCode?: string;
    state?: string;
    district?: string;
  }) => Promise<CivicUser>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  switchDemoAccount: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CivicUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const authMode = isSupabaseConfigured ? 'SUPABASE_CLOUD' : 'SECURE_CRYPTO_LOCAL';

  // Initialize session on mount
  useEffect(() => {
    try {
      const stored = getStoredSession();
      if (stored && stored.user) {
        setUser(stored.user);
      } else {
        // Default to Priya Sharma (Citizen) demo for seamless initial hackathon evaluation
        const defaultCitizen = DEFAULT_DEMO_ACCOUNTS[0];
        const citizenUser: CivicUser = {
          id: defaultCitizen.id,
          email: defaultCitizen.email,
          fullName: defaultCitizen.fullName,
          role: defaultCitizen.role,
          state: defaultCitizen.state,
          district: defaultCitizen.district,
          createdAt: defaultCitizen.createdAt,
        };
        setUser(citizenUser);
        saveSession({
          user: citizenUser,
          token: 'demo_token_citizen',
          expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
        });
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<CivicUser> => {
    const { user: authedUser, token } = await authenticateUser(email, password);
    setUser(authedUser);
    saveSession({
      user: authedUser,
      token,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    });
    return authedUser;
  };

  const signup = async (params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    adminInviteCode?: string;
    state?: string;
    district?: string;
  }): Promise<CivicUser> => {
    const { user: registeredUser, token } = await registerUser(params);
    setUser(registeredUser);
    saveSession({
      user: registeredUser,
      token,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    });
    return registeredUser;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const requestPasswordReset = async (email: string): Promise<string> => {
    return createPasswordResetToken(email);
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    return resetPasswordWithToken(token, newPassword);
  };

  const switchDemoAccount = (role: UserRole) => {
    const target = DEFAULT_DEMO_ACCOUNTS.find((a) => a.role === role) || DEFAULT_DEMO_ACCOUNTS[0];
    const switchedUser: CivicUser = {
      id: target.id,
      email: target.email,
      fullName: target.fullName,
      role: target.role,
      state: target.state,
      district: target.district,
      department: target.department,
      createdAt: target.createdAt,
    };
    setUser(switchedUser);
    saveSession({
      user: switchedUser,
      token: `demo_token_${role}`,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    });
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isCitizen = user?.role === 'citizen';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isCitizen,
        authMode,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        switchDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
