import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { authAPI } from '@/services/api';

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
            };
            setUser(userData);
            localStorage.setItem('token', session.access_token);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      );

      setLoading(false);
      return () => authListener?.subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    full_name: string
  ) => {
    const response = await authAPI.register({
      email,
      password,
      full_name,
    });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: { full_name?: string }) => {
    const response = await authAPI.updateProfile(data);
    const updatedUser = response.data.user;

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    return updatedUser;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };
};