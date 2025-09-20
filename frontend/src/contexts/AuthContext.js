"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

const login = async (credentials) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    );

      const result = await response.json();

      if (result.success) {
        // Store token and user data
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        setToken(result.data.token);
        setUser(result.data.user);

        toast.success('Login successful!');
        return { success: true, data: result.data };
      } else {
        toast.error(result.message || 'Login failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return { success: false, error: 'An error occurred during login' };
    }
  };

const signup = async (userData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      setToken(result.data.token);
      setUser(result.data.user);

      toast.success('Account created successfully!');
      return { success: true, data: result.data };
    } else {
      toast.error(result.message || 'Signup failed');
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('An error occurred during signup');
    return { success: false, error: 'An error occurred during signup' };
  }
};

const demoLogin = async (email) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/demo-login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      setToken(result.data.token);
      setUser(result.data.user);

      toast.success('Demo login successful!');
      return { success: true, data: result.data };
    } else {
      toast.error(result.message || 'Demo login failed');
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Demo login error:', error);
    toast.error('An error occurred during demo login');
    return { success: false, error: 'An error occurred during demo login' };
  }
};


  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    toast.success('Logged out successfully');
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const setUserAndToken = (userData, tokenData) => {
    // Set both user and token simultaneously
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    
    // Force a small delay to ensure state is updated
    setTimeout(() => {
      console.log('OAuth authentication completed:', { user: userData, token: tokenData });
    }, 100);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    demoLogin,
    logout,
    updateUser,
    setUser,
    setToken,
    setUserAndToken,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
