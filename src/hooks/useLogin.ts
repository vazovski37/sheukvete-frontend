import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const login = async (credentials: UserLogin) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, role } = await authService.login(credentials);
      setToken(token);
      setRole(role);

      // Store token & role in secure cookies
      setCookie(null, 'token', token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      setCookie(null, 'role', role, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      // Role-based redirection logic
      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'WAITER') {
        router.push('/waiter');
      } else {
        router.push('/');
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
    router.push('/login');
  };

  return { login, logout, isLoading, error, token, role };
};
