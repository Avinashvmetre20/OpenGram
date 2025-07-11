import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getMe();
          setUser(userData.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    const response = await authService.register(userData);
    const userDataRes = await authService.getMe();
    setUser(userDataRes.data);
    setIsAuthenticated(true);
    return response;
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const userData = await authService.getMe();
    setUser(userData.data);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserDetails = async (userData) => {
    const response = await authService.updateDetails(userData);
    const userDataRes = await authService.getMe();
    setUser(userDataRes.data);
    return response;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.updatePassword({
        currentPassword,
        newPassword
      });
      
      // Optionally refresh user data after password change
      const userData = await authService.getMe();
      setUser(userData.data);
      
      return response;
    } catch (error) {
      console.error('Password update failed:', error);
      throw error; // Re-throw to handle in component
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        updateUserDetails,
        updatePassword, // Changed from updateUserPassword to match component usage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);