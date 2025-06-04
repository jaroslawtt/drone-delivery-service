"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren, Suspense } from "react";

const queryClient = new QueryClient();

type Properties = PropsWithChildren;

const Providers: FC<Properties> = ({ children }: Properties) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>{children}</Suspense>
    </QueryClientProvider>
  );
};

export { Providers };
