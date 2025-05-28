// src/features/auth/login/useLogin.ts
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; // ✅ Correct for App Router
  // No need for useEffect anymore
import { setCookie } from 'nookies';

import { generalLogin } from '@/features/auth/api';
import { useUserStore } from '@/stores/userStore';
import { loginSchema, LoginSchema } from '@/schemas/loginSchema';

export function useLogin() {
  const setUser = useUserStore((state) => state.setUser);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();  // Directly call useRouter() here

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginSchema) => {
    try {
      const user = await generalLogin(formData);
      setUser(user);

      // Store token and role in cookies
      setCookie(null, 'token', user.token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: true,
        sameSite: 'Strict',
        httpOnly: false,
      });

      setCookie(null, 'role', user.role, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: true,
        sameSite: 'Strict',
        httpOnly: false,
      });

      // Role-based redirection
      if (user.role === 'ADMIN') {
        router.replace('/admin');
      } else if (user.role === 'WAITER') {
        router.replace('/waiter');
      } else if (user.role === 'STAFF') {
        router.replace('/staff');
      } else if (user.role === 'KITCHEN') {
        router.replace('/kitchen');
      } else {
        router.replace('/');
      }


    } catch (e) {
      setErrorMessage('Invalid login credentials');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, errorMessage };
}
