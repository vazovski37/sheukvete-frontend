import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { UserLogin } from '@/types/user';
import { authService } from '@/services/authService';

export const useLogin = () => {
  const router = useRouter();
  const cookies = parseCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(cookies.token || null);
  const [role, setRole] = useState<string | null>(cookies.role || null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const login = async (credentials: UserLogin) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, role } = await authService.login(credentials);
      setToken(token);
      setRole(role);

      // Securely store token & role in cookies
      setCookie(null, 'token', token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: true, // Ensures it's sent over HTTPS
        sameSite: 'Strict',
        httpOnly: false, // Ensures client can access it if needed
      });

      setCookie(null, 'role', role, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: true,
        sameSite: 'Strict',
        httpOnly: false,
      });

      console.log("Login successful, role:", role);

      // Redirect based on role
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else if (role === 'WAITER') {
        router.replace('/waiter');
      } else if (role === 'KITCHEN') {
        router.replace('/waiter');
      } else {
        router.replace('/');
      }

      return { token, role };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'role');
    setToken(null);
    setRole(null);
    router.replace('/login');
  };

  return { login, logout, isLoading, error, token, role };
};
