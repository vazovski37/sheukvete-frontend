// src/features/auth/generalLogin/useLogin.ts
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, destroyCookie } from 'nookies';
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
      const user = await generalLogin(formData);
      setUser(user);

      // Debugging: Log user object from API response
      console.log("DEBUG: User object received after general login (internal user):", user);

      // --- CRITICAL CHANGE: Set the 'token' from the JSON response as a client-side cookie ---
      // Your backend returns the 'token' directly in the JSON body for /auth/general/login.
      // We must manually set this as a client-side cookie.
      if (user.token) { // Ensure the token exists in the response data
        setCookie(null, 'token', user.token, {
          maxAge: 7 * 24 * 60 * 60, // 7 days (or match your backend's JWT expiration)
          path: '/', // Make it accessible across the entire frontend
          // For localhost (HTTP), 'secure' must be false. In production (HTTPS), it should be true.
          secure: process.env.NODE_ENV === 'production',
          // 'SameSite' attribute for security: 'Lax' or 'Strict' is generally recommended.
          // 'HttpOnly' must be false for JavaScript to set it.
          sameSite: 'Lax',
          httpOnly: false,
        });
        console.log("DEBUG: Manually set client-side 'token' cookie from JSON response.");
      } else {
        console.warn("DEBUG: 'token' field not found in general login response body. Cannot set client-side cookie.");
      }
      // --- END CRITICAL CHANGE ---


      // Store role as non-HttpOnly if frontend needs direct access (e.g., for conditional UI rendering)
      setCookie(null, 'role', user.role, {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        httpOnly: false,
      });

      // Debugging: Show all client-side cookies after setting both
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      console.log("DEBUG: All client-side cookies after general login:", cookies);


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