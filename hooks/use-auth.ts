import { storageService, UserData } from '@/services/storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [authenticated, userData] = await Promise.all([
        storageService.isAuthenticated(),
        storageService.getUserData(),
      ]);

      setIsAuthenticated(authenticated);
      setUser(userData);

      // Se não estiver autenticado, redireciona para login
      if (!authenticated) {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await storageService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    checkAuthStatus,
  };
};
