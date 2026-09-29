"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { transicao } from "@/constants/animacao";

let clienteNoNavegador: QueryClient | undefined;

function obterQueryClient() {
  if (typeof window === "undefined") return new QueryClient();
  clienteNoNavegador ??= new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return clienteNoNavegador;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={obterQueryClient()}>
      <MotionConfig reducedMotion="user" transition={transicao.padrao}>
        {children}
      </MotionConfig>
    </QueryClientProvider>
  );
}
