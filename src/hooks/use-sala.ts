"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { comParticipante } from "@/lib/estado-sala";
import { salvarSessao } from "@/lib/sessao";
import type { Papel } from "@/schemas/participante.schema";
import type { EntradaSala, EstadoSala } from "@/schemas/sala.schema";
import { salaService } from "@/services/sala.service";

import { queryKeys } from "./query-keys";

export function useSala(codigo: string) {
  return useQuery({
    queryKey: queryKeys.sala(codigo),
    queryFn: () => salaService.buscar(codigo),
  });
}

function lembrarEntrada({ codigoSala, participante }: EntradaSala) {
  const sessao = {
    participanteId: participante.id,
    apelido: participante.apelido,
  };
  salvarSessao(codigoSala, sessao);
  return sessao;
}

export function useCriarSala() {
  return useMutation({
    mutationFn: salaService.criar,
    onSuccess: lembrarEntrada,
  });
}

export function useEntrarNaSala() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      codigo,
      ...dados
    }: {
      codigo: string;
      apelido: string;
      papel: Papel;
    }) => salaService.entrar(codigo, dados),
    onSuccess: (entrada) => {
      lembrarEntrada(entrada);
      queryClient.setQueryData<EstadoSala>(
        queryKeys.sala(entrada.codigoSala),
        (sala) => sala && comParticipante(sala, entrada.participante),
      );
    },
  });
}
