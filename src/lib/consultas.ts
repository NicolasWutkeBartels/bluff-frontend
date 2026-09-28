"use client";

import { useQuery } from "@tanstack/react-query";

import { buscarBaralhos, buscarDominio, buscarHistorico, buscarSala } from "./api";

/** Chaves do cache do React Query num lugar só, para o WebSocket atualizar os mesmos dados. */
export const chaves = {
  sala: (codigo: string) => ["sala", codigo] as const,
  historico: (codigo: string) => ["historico", codigo] as const,
  historicoFiltrado: (codigo: string, status: string) => ["historico", codigo, status] as const,
  dominio: (dominio: string) => ["dominio", dominio] as const,
  baralhos: ["baralhos"] as const,
};

/** Valores fixos (status, baralhos) quase nunca mudam: ficam em cache pela vida da página. */
const PARA_SEMPRE = { staleTime: Infinity, gcTime: Infinity };

export function useDominio(dominio: string) {
  return useQuery({ queryKey: chaves.dominio(dominio), queryFn: () => buscarDominio(dominio), ...PARA_SEMPRE });
}

export function useBaralhos() {
  return useQuery({ queryKey: chaves.baralhos, queryFn: buscarBaralhos, ...PARA_SEMPRE });
}

export function useSala(codigo: string) {
  return useQuery({ queryKey: chaves.sala(codigo), queryFn: () => buscarSala(codigo) });
}

export function useHistorico(codigo: string, status: string) {
  return useQuery({
    queryKey: chaves.historicoFiltrado(codigo, status),
    queryFn: () => buscarHistorico(codigo, status || undefined),
  });
}
