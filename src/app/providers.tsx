"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { transicao } from "@/lib/movimento";

let clienteNoNavegador: QueryClient | undefined;

function obterQueryClient() {
  // No servidor, um cliente por renderização; no navegador, um só para a vida da página.
  if (typeof window === "undefined") return new QueryClient();
  clienteNoNavegador ??= new QueryClient({
    defaultOptions: {
      queries: {
        // Os eventos do WebSocket mantêm os dados atualizados; não precisamos refazer a busca a cada foco.
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
      {/* reducedMotion="user": com prefers-reduced-motion, o Motion desliga deslocamentos e mantém fades. */}
      <MotionConfig reducedMotion="user" transition={transicao.padrao}>
        {children}
      </MotionConfig>
    </QueryClientProvider>
  );
}
