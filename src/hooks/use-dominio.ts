"use client";

import { useQuery } from "@tanstack/react-query";

import { dominioService } from "@/services/dominio.service";

import { CACHE_PERMANENTE, queryKeys } from "./query-keys";

export function useDominio(dominio: string) {
  return useQuery({
    queryKey: queryKeys.dominio(dominio),
    queryFn: () => dominioService.listar(dominio),
    ...CACHE_PERMANENTE,
  });
}
