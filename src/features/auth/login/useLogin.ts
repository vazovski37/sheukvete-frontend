// src/features/auth/login/useLogin.ts
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { toast } from 'sonner';

import { login } from '@/features/auth/api';
import { useUserStore } from '@/stores/userStore';
import { loginSchema, LoginSchema } from '@/schemas/loginSchema';

export function useLogin() {
  const setUser = useUserStore((state) => state.setUser);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginSchema) => {
    setErrorMessage('');
    try {
      const user = await login(formData);
      setUser(user);

      // Debugging: Log user object from API response
      console.log("DEBUG: User object received after initial login (SYSTEMADMIN):", user);

      // We explicitly DO NOT set 'RESTAURANT_JWT' here as it's HttpOnly and set by the backend/proxy.
      // We only set the 'role' cookie if it needs to be accessible by client-side JavaScript.
      setCookie(null, 'role', user.role, {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        httpOnly: false, // Must be false for frontend to read it
      });

      // Debugging: Show only the 'role' cookie, as HttpOnly JWTs won't be visible here.
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log("DEBUG: Client-side cookies after initial login (check browser dev tools for HttpOnly RESTAURANT_JWT):", cookies);


      console.log("Attempting to redirect based on role:", user.role);

      if (user.role === 'RESTAURANT') {
        console.log("Redirecting to /genLogin");
        router.replace('/genLogin');
      } else if (user.role === 'SYSTEMADMIN') {
        console.log("Redirecting to /sysadmin");
        router.replace('/sysadmin');
      } else {
        console.log("Redirecting to /");
        router.replace('/');
      }
      toast.success("Login successful!");

    } catch (e: any) {
      console.error("Login failed:", e );
      setErrorMessage(e.response.error || 'Invalid login credentials');
      toast.error(e.response.error || 'Invalid login credentials');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, errorMessage };
}