import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const heartbeatIntervalRef = useRef(null);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('chatflow_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.isAuthenticated) {
          setUser(userData);
          setUserProfile(userData);
        }
      } catch (error) {
        localStorage.removeItem('chatflow_user');
      }
    }
    setLoading(false);
  }, []);

  // Set user online when authenticated and start heartbeat
  useEffect(() => {
    if (user?.id) {
      // Set user online
      setUserOnlineStatus();

      // Start heartbeat every 30 seconds
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, 30000);

      // Set user offline when page is closed/refreshed
      const handleBeforeUnload = () => {
        setUserOfflineStatus();
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          setUserOfflineStatus();
        } else {
          setUserOnlineStatus();
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        setUserOfflineStatus();
      };
    }
  }, [user]);

  const setUserOnlineStatus = async () => {
    try {
      const { userAPI } = await import('../services/api');
      await userAPI.setOnline();
    } catch (error) {
      console.error('Failed to set user online:', error);
    }
  };

  const setUserOfflineStatus = async () => {
    try {
      const { userAPI } = await import('../services/api');
      await userAPI.setOffline();
    } catch (error) {
      console.error('Failed to set user offline:', error);
    }
  };

  const sendHeartbeat = async () => {
    try {
      const { userAPI } = await import('../services/api');
      await userAPI.heartbeat();
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
    }
  };

  const signUp = async ({ email, password, username, fullName }) => {
    try {
      const { authAPI } = await import('../services/api');
      const response = await authAPI.register({
        email,
        password,
        username,
        fullName
      });
      
      if (response.token) {
        localStorage.setItem('chatflow_token', response.token);
        localStorage.setItem('chatflow_user', JSON.stringify(response.user));
        setUser(response.user);
        setUserProfile(response.user);
        return { data: response.user, error: null };
      }
      
      return { data: null, error: { message: 'Registration failed' } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { authAPI } = await import('../services/api');
      const response = await authAPI.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('chatflow_token', response.token);
        localStorage.setItem('chatflow_user', JSON.stringify(response.user));
        setUser(response.user);
        setUserProfile(response.user);
        return { data: response.user, error: null };
      }
      
      return { data: null, error: { message: 'Login failed' } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    try {
      // Set user offline before signing out
      await setUserOfflineStatus();
      
      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      localStorage.removeItem('chatflow_user');
      localStorage.removeItem('chatflow_token');
      setUser(null);
      setUserProfile(null);
      return { error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user?.id) return { data: null, error: { message: 'No user logged in' } };
    
    try {
      const updatedUser = { ...userProfile, ...updates };
      localStorage.setItem('chatflow_user', JSON.stringify(updatedUser));
      setUserProfile(updatedUser);
      return { data: updatedUser, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
