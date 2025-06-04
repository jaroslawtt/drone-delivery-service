"use client";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "~/stores/auth/auth";

type Properties = PropsWithChildren;

const MainLayout: FC<Properties> = ({ children }: Properties) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in");
    }
  }, [user, router]);

  return <>{children}</>;
};

export default MainLayout;
