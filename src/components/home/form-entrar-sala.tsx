"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ariaDoCampo, Campo, errosPorCampo, MensagemErro } from "@/components/formulario/campo";
import { SeletorPapel } from "@/components/formulario/seletor-papel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { entrarNaSala, lerErro } from "@/lib/api";
import { formEntrarSala, type FormEntrarSala } from "@/lib/esquemas";
import { salvarSessao } from "@/lib/sessao";

export function FormEntrarSala() {
  const router = useRouter();
  const [form, setForm] = useState<FormEntrarSala>({ codigo: "", apelido: "", papel: "VOTANTE" });
  const [erros, setErros] = useState<Record<string, string>>({});

  const entrada = useMutation({
    mutationFn: (dados: FormEntrarSala) => entrarNaSala(dados.codigo, dados.apelido, dados.papel),
    onSuccess: ({ codigoSala, participante }) => {
      salvarSessao(codigoSala, { participanteId: participante.id, apelido: participante.apelido });
      router.push(`/sala/${codigoSala}`);
    },
  });

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = formEntrarSala.safeParse(form);
    if (!resultado.success) {
      setErros(errosPorCampo(resultado.error));
      return;
    }
    setErros({});
    entrada.mutate(resultado.data);
  }

  const mudar = <K extends keyof FormEntrarSala>(campo: K, valor: FormEntrarSala[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  const erroDaApi = entrada.isError ? lerErro(entrada.error) : null;

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-[9rem_1fr] lg:grid-cols-1 xl:grid-cols-[9rem_1fr]">
        <Campo id="codigo" rotulo="Código da sala" erro={erros.codigo}>
          <Input
            {...ariaDoCampo("codigo", erros.codigo)}
            placeholder="K7PX3M"
            value={form.codigo}
            onChange={(e) => mudar("codigo", e.target.value.toUpperCase())}
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
            className="algarismos text-[17px] font-[600] tracking-[0.12em] [font-stretch:85%] placeholder:tracking-[0.12em]"
          />
        </Campo>
        <Campo id="apelido-entrar" rotulo="Seu apelido" erro={erros.apelido}>
          <Input
            {...ariaDoCampo("apelido-entrar", erros.apelido)}
            placeholder="Como o time te chama"
            value={form.apelido}
            onChange={(e) => mudar("apelido", e.target.value)}
            maxLength={30}
            autoComplete="nickname"
          />
        </Campo>
      </div>

      <SeletorPapel valor={form.papel} aoMudar={(papel) => mudar("papel", papel)} />

      <div className="grid gap-3 pt-1">
        <Button type="submit" variant="quieto" disabled={entrada.isPending} className="w-full sm:w-fit">
          {entrada.isPending ? "Entrando…" : "Entrar na sala"}
        </Button>
        {erroDaApi && <MensagemErro>{erroDaApi.mensagem}</MensagemErro>}
      </div>
    </form>
  );
}
