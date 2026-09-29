export const queryKeys = {
  sala: (codigo: string) => ["sala", codigo] as const,
  historico: (codigo: string) => ["historico", codigo] as const,
  historicoFiltrado: (codigo: string, status: string) =>
    ["historico", codigo, status] as const,
  dominio: (dominio: string) => ["dominio", dominio] as const,
  baralhos: ["baralhos"] as const,
};

export const CACHE_PERMANENTE = { staleTime: Infinity, gcTime: Infinity };
