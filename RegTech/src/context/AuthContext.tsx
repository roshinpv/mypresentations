import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api';

interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if token exists and validate it
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // For now, we'll just assume the token is valid
        // In a real app, you'd verify the token with the server
        setIsLoading(false);
        
        // Mock user data - in a real app, you'd fetch this from the server
        setUser({
          id: 'user-001',
          username: 'admin',
          email: 'admin@example.com',
          is_admin: true,
          is_active: true
        });
      } catch (err) {
        console.error('Token validation error:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authAPI.login(username, password);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      
      // Mock user data - in a real app, you'd fetch this from the server
      setUser({
        id: 'user-001',
        username,
        email: 'admin@example.com', // This would come from the server
        is_admin: true,
        is_active: true
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authAPI.register({ username, email, password });
      // After registration, log the user in
      await login(username, password);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};