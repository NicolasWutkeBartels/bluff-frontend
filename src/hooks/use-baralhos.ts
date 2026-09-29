"use client";

import { useQuery } from "@tanstack/react-query";

import { baralhoService } from "@/services/baralho.service";

import { CACHE_PERMANENTE, queryKeys } from "./query-keys";

export function useBaralhos() {
  return useQuery({
    queryKey: queryKeys.baralhos,
    queryFn: baralhoService.listar,
    ...CACHE_PERMANENTE,
  });
}
