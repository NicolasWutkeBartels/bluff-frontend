"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { ariaDoCampo, MensagemErro } from "@/components/formulario/campo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iniciarRodada, lerErro, revelar } from "@/lib/api";
import { chaves } from "@/lib/consultas";
import { formNovaRodada, STATUS_RODADA, type EstadoSala } from "@/lib/esquemas";

const SEM_ESTIMATIVA = "sem-estimativa";

type Props = { sala: EstadoSala; meuId: string };

/** Cabeçalho da mesa: o que está sendo estimado, quantos já votaram e a próxima ação. */
export function PainelRodada({ sala, meuId }: Props) {
  const rodada = sala.rodadaAtual;
  const votando = rodada?.status.codigo === STATUS_RODADA.votando;

  if (rodada && votando) {
    const totalVotantes = sala.participantes.filter((p) => p.papel === "VOTANTE").length;
    return (
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="grid min-w-0 gap-1.5">
          <h2 className="text-[24px] leading-tight font-[600] tracking-[-0.02em] text-balance">{rodada.titulo}</h2>
          <p className="algarismos text-[13px] text-musgo" aria-live="polite">
            {contagemDeVotos(rodada.votos.length, totalVotantes)}
          </p>
        </div>
        <RevelarVotos sala={sala} rodadaId={rodada.id} meuId={meuId} />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {rodada ? (
        <div className="grid gap-1.5">
          <h2 className="text-[24px] leading-tight font-[600] tracking-[-0.02em] text-balance">{rodada.titulo}</h2>
          <p className="algarismos text-[13px] text-musgo">
            {rodada.estimativaFinal ? `Estimativa final: ${rodada.estimativaFinal}` : "Votos revelados"}
          </p>
        </div>
      ) : (
        <div className="grid gap-1.5">
          <h2 className="text-[24px] leading-tight font-[600] tracking-[-0.02em]">Crie a primeira rodada</h2>
          <p className="text-[13px] text-musgo">Diga o que o time vai estimar. As cartas ficam liberadas na hora.</p>
        </div>
      )}
      <NovaRodada codigoSala={sala.codigo} meuId={meuId} primeira={!rodada} />
    </div>
  );
}

function contagemDeVotos(votos: number, total: number) {
  if (votos === 0) return "Ninguém votou ainda";
  if (votos >= total) return total === 1 ? "Seu voto está na mesa" : "Todos votaram";
  return `${votos} de ${total} já votaram`;
}

function NovaRodada({ codigoSala, meuId, primeira }: { codigoSala: string; meuId: string; primeira: boolean }) {
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [erroCampo, setErroCampo] = useState<string>();

  const inicio = useMutation({
    mutationFn: (texto: string) => iniciarRodada(codigoSala, meuId, texto),
    onSuccess: (rodada) => {
      setTitulo("");
      queryClient.setQueryData<EstadoSala>(chaves.sala(codigoSala), (sala) => sala && { ...sala, rodadaAtual: rodada });
      queryClient.invalidateQueries({ queryKey: chaves.historico(codigoSala) });
    },
  });

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = formNovaRodada.safeParse({ titulo });
    if (!resultado.success) {
      setErroCampo(resultado.error.issues[0]?.message);
      return;
    }
    setErroCampo(undefined);
    inicio.mutate(resultado.data.titulo);
  }

  const erro = erroCampo ?? (inicio.isError ? lerErro(inicio.error).mensagem : undefined);

  return (
    <form onSubmit={enviar} noValidate className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="titulo-rodada" className="sr-only">
          O que vamos estimar
        </label>
        <Input
          {...ariaDoCampo("titulo-rodada", erro)}
          placeholder={primeira ? "Ex.: tela de login" : "O que vamos estimar agora?"}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={200}
          autoComplete="off"
          className="sm:max-w-md"
        />
        <Button type="submit" disabled={inicio.isPending}>
          {inicio.isPending ? "Começando…" : "Começar rodada"}
        </Button>
      </div>
      {erro && <MensagemErro id="titulo-rodada-erro">{erro}</MensagemErro>}
    </form>
  );
}

function RevelarVotos({ sala, rodadaId, meuId }: { sala: EstadoSala; rodadaId: string; meuId: string }) {
  const queryClient = useQueryClient();
  const [estimativa, setEstimativa] = useState(SEM_ESTIMATIVA);

  const revelacao = useMutation({
    mutationFn: () => revelar(rodadaId, meuId, estimativa === SEM_ESTIMATIVA ? undefined : estimativa),
    onSuccess: (rodada) => {
      queryClient.setQueryData<EstadoSala>(chaves.sala(sala.codigo), (atual) => atual && { ...atual, rodadaAtual: rodada });
      queryClient.invalidateQueries({ queryKey: chaves.historico(sala.codigo) });
    },
  });

  return (
    <div className="grid justify-items-start gap-3 sm:justify-items-end">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={estimativa} onValueChange={setEstimativa}>
          <SelectTrigger size="sm" aria-label="Estimativa final" className="w-auto min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectItem value={SEM_ESTIMATIVA}>Sem estimativa final</SelectItem>
            {sala.baralho.cartas.map((carta) => (
              <SelectItem key={carta} value={carta}>
                Estimativa final: {carta}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => revelacao.mutate()} disabled={revelacao.isPending}>
          {revelacao.isPending ? "Revelando…" : "Revelar votos"}
        </Button>
      </div>
      {revelacao.isError && <MensagemErro>{lerErro(revelacao.error).mensagem}</MensagemErro>}
    </div>
  );
}
