"use client";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { Sidebar } from "~/_pages/main/components/sidebar/sidebar";
import { Map } from "~/libs/components/components";
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

  return (
    <main className="relative h-[100dvh] w-screen">
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      <Sidebar />
      <div className="absolute z-10 w-full bottom-0 h-auto pointer-events-auto overflow-y-auto overscroll-contain">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
