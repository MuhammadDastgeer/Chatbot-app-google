"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const AUTH_COOKIE_KEY = 'auth-token';

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  const login = () => {
    Cookies.set(AUTH_COOKIE_KEY, 'true', { expires: 2 }); 
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove(AUTH_COOKIE_KEY);
    router.push('/login');
  };

  const checkAuth = () => {
    const isAuthenticated = !!Cookies.get(AUTH_COOKIE_KEY);
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/verify-email' || pathname === '/verify-reset-code' || pathname === '/reset-password' || pathname === '/';

    if (isAuthenticated && isAuthPage) {
      router.replace('/dashboard');
    }

    if (!isAuthenticated && pathname === '/dashboard') {
      router.replace('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname, router]);

  return { login, logout };
};
