// src/features/auth/generalLogin/useLogin.ts
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { toast } from 'sonner';

import { generalLogin } from '@/features/auth/api';
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
      // user.token will be undefined here now, as it's not in JSON response
      const user = await generalLogin(formData);
      setUser(user);

      // REMOVED: setCookie for 'token'
      // The user-level 'token' cookie is now set by the Spring Boot backend
      // via a Set-Cookie header, and this header is forwarded by the Next.js API proxy.

      // Store role as non-HttpOnly if frontend needs direct access (e.g., for conditional UI rendering)
      setCookie(null, 'role', user.role, {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        httpOnly: false,
      });

      console.log("User object after successful general login:", user);
      console.log("Attempting to redirect based on role:", user.role);

      if (user.role === 'ADMIN') {
        console.log("Redirecting to /admin");
        router.replace('/admin');
      } else if (user.role === 'WAITER') {
        console.log("Redirecting to /waiter");
        router.replace('/waiter');
      } else if (user.role === 'STAFF') {
        console.log("Redirecting to /staff");
        router.replace('/staff');
      } else if (user.role === 'KITCHEN') {
        console.log("Redirecting to /kitchen");
        router.replace('/kitchen');
      } else {
        console.log("Redirecting to /");
        router.replace('/');
      }
      toast.success("Login successful!");

    } catch (e: any) {
      console.error("General login failed:", e);
      setErrorMessage(e.message || 'Invalid login credentials');
      toast.error(e.message || 'Invalid login credentials');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, errorMessage };
}