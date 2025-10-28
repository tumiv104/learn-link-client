"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserDto } from "@/services/auth/authService";

export default function useRequireAuth(redirectTo = "/auth/login", allowedRoles?: string[]) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(redirectTo);
      } else if (allowedRoles && user && !allowedRoles.includes(user.role || "")) {
        router.replace("/");
      }
    }
  }, [loading, isAuthenticated, user, router, redirectTo, allowedRoles]);

  return { isAuthenticated, loading, user: user as UserDto, ready: !loading && isAuthenticated && (!allowedRoles || allowedRoles.includes(user?.role || "")) };
}
