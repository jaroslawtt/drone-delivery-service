"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";
import { authApi, LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "~/packages/auth/auth";
import {
  type AuthGetCurrentResponseDto,
  type AuthGenerateAccessResponseDto,
} from "~/packages/auth/auth";
import { useAuthStore } from "~/stores/auth/auth";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: fetchAccessToken, isError } =
    useMutation<AuthGenerateAccessResponseDto>({
      mutationFn: authApi.generateAccessToken.bind(authApi),
      onSuccess: (payload) => {
        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY,
          payload.accessToken,
        );
        fetchCurrent();
      },
    });
  const { mutate: fetchCurrent } = useMutation<AuthGetCurrentResponseDto>({
    mutationFn: authApi.getCurrentUser.bind(authApi),
    onSuccess: (payload) => {
      setUser(payload.user);
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      fetchAccessToken();
    },
  });

  useEffect(() => {
    if (user) {
      return void router.push("/");
    }

    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

    if (accessToken && !isError) {
      return void fetchCurrent();
    } else if (!accessToken && !isError) {
      return void fetchAccessToken();
    }
  }, [router, user, fetchCurrent, isError, fetchAccessToken]);

  return (
    <main className="relative flex items-center justify-center min-w-screen min-h-[100dvh]">
      {children}
    </main>
  );
};

export default AuthLayout;
