import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/api';

type AppRole = 'admin' | 'customer';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: AppRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: AppRole | null;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  const applyUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    setUserRole(nextUser?.role ?? null);
    setIsAdmin(nextUser?.role === 'admin');
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { user: sessionUser } = await apiRequest<{ user: AuthUser }>("/api/auth/me");
        if (isMounted) {
          applyUser(sessionUser);
        }
      } catch (error) {
        if (isMounted) {
          applyUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const { user: nextUser } = await apiRequest<{ user: AuthUser }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name, phone }),
      });

      applyUser(nextUser);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: nextUser } = await apiRequest<{ user: AuthUser }>("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      applyUser(nextUser);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await apiRequest("/api/auth/signout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      applyUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        userRole,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
