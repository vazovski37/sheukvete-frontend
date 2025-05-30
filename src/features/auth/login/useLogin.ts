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

      // REMOVED: setCookie for 'token' (now 'RESTAURANT_JWT')
      // The 'RESTAURANT_JWT' cookie is now set by the Spring Boot backend
      // via a Set-Cookie header, and this header is forwarded by the Next.js API proxy.

      // Store role as non-HttpOnly if frontend needs direct access (e.g., for conditional UI rendering)
      setCookie(null, 'role', user.role, {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        httpOnly: false,
      });

      console.log("User object after successful login:", user);
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
      console.error("Login failed:", e);
      setErrorMessage(e.message || 'Invalid login credentials');
      toast.error(e.message || 'Invalid login credentials');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, errorMessage };
}