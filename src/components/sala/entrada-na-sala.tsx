"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { VersoCarta } from "@/components/carta/carta";
import { ariaDoCampo, Campo, MensagemErro } from "@/components/formulario/campo";
import { SeletorPapel } from "@/components/formulario/seletor-papel";
import { Logo } from "@/components/marca/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { entrarNaSala, lerErro } from "@/lib/api";
import { chaves } from "@/lib/consultas";
import { formEntrarSala, type EstadoSala, type Papel } from "@/lib/esquemas";
import { salvarSessao, type Sessao } from "@/lib/sessao";

/** Quem abre o link de convite sem estar na sala escolhe um apelido aqui. */
export function EntradaNaSala({
  codigo,
  nome,
  aoEntrar,
}: {
  codigo: string;
  nome: string;
  aoEntrar: (sessao: Sessao) => void;
}) {
  const queryClient = useQueryClient();
  const [apelido, setApelido] = useState("");
  const [papel, setPapel] = useState<Papel>("VOTANTE");
  const [erroCampo, setErroCampo] = useState<string>();

  const entrada = useMutation({
    mutationFn: () => entrarNaSala(codigo, apelido.trim(), papel),
    onSuccess: ({ codigoSala, participante }) => {
      const sessao = { participanteId: participante.id, apelido: participante.apelido };
      salvarSessao(codigoSala, sessao);
      // O estado da sala em cache foi buscado antes da entrada e ainda não tem esta pessoa.
      // Sem isso, a página não reconhece o participante e não abre a mesa.
      queryClient.setQueryData<EstadoSala>(chaves.sala(codigoSala), (sala) =>
        sala && !sala.participantes.some((p) => p.id === participante.id)
          ? { ...sala, participantes: [...sala.participantes, participante] }
          : sala,
      );
      aoEntrar(sessao);
    },
  });

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = formEntrarSala.shape.apelido.safeParse(apelido);
    if (!resultado.success) {
      setErroCampo(resultado.error.issues[0]?.message);
      return;
    }
    setErroCampo(undefined);
    entrada.mutate();
  }

  return (
    <main className="mx-auto grid w-full max-w-[1120px] gap-16 px-6 pt-8 pb-24 sm:px-12">
      <header>
        <Logo />
      </header>
      <section className="grid max-w-md gap-10">
        <div className="flex items-end gap-5">
          <VersoCarta semente={codigo} tamanho="mesa" />
          <div className="grid gap-1.5 pb-1">
            <p className="text-[13px] text-musgo">Você foi convidado para</p>
            <h1 className="text-[30px] leading-tight font-[650] tracking-[-0.025em] [font-stretch:90%]">{nome}</h1>
          </div>
        </div>
        <form onSubmit={enviar} noValidate className="grid gap-5">
          <Campo id="apelido-convite" rotulo="Seu apelido" erro={erroCampo}>
            <Input
              {...ariaDoCampo("apelido-convite", erroCampo)}
              placeholder="Como o time te chama"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              maxLength={30}
              autoComplete="nickname"
              autoFocus
            />
          </Campo>
          <SeletorPapel valor={papel} aoMudar={setPapel} />
          <div className="grid gap-3 pt-1">
            <Button type="submit" disabled={entrada.isPending} className="w-full sm:w-fit">
              {entrada.isPending ? "Entrando…" : "Entrar na sala"}
            </Button>
            {entrada.isError && <MensagemErro>{lerErro(entrada.error).mensagem}</MensagemErro>}
          </div>
        </form>
      </section>
    </main>
  );
}
