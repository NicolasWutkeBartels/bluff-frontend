"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ariaDoCampo, Campo, errosPorCampo, MensagemErro } from "@/components/formulario/campo";
import { SeletorPapel } from "@/components/formulario/seletor-papel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { criarSala, lerErro } from "@/lib/api";
import { useBaralhos } from "@/lib/consultas";
import { formCriarSala, type FormCriarSala } from "@/lib/esquemas";
import { salvarSessao } from "@/lib/sessao";

export function FormCriarSala() {
  const router = useRouter();
  const baralhos = useBaralhos();
  const [form, setForm] = useState<FormCriarSala>({ nomeSala: "", apelido: "", baralho: "FIBONACCI", papel: "VOTANTE" });
  const [erros, setErros] = useState<Record<string, string>>({});

  const criacao = useMutation({
    mutationFn: criarSala,
    onSuccess: ({ codigoSala, participante }) => {
      salvarSessao(codigoSala, { participanteId: participante.id, apelido: participante.apelido });
      router.push(`/sala/${codigoSala}`);
    },
    onError: (erro) => setErros(lerErro(erro).campos ?? {}),
  });

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = formCriarSala.safeParse(form);
    if (!resultado.success) {
      setErros(errosPorCampo(resultado.error));
      return;
    }
    setErros({});
    criacao.mutate(resultado.data);
  }

  const mudar = <K extends keyof FormCriarSala>(campo: K, valor: FormCriarSala[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }));

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5">
      <Campo id="nome-sala" rotulo="Nome da sala" erro={erros.nomeSala}>
        <Input
          {...ariaDoCampo("nome-sala", erros.nomeSala)}
          placeholder="Time Azul, sprint 42"
          value={form.nomeSala}
          onChange={(e) => mudar("nomeSala", e.target.value)}
          maxLength={80}
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="apelido-criar" rotulo="Seu apelido" erro={erros.apelido}>
          <Input
            {...ariaDoCampo("apelido-criar", erros.apelido)}
            placeholder="Como o time te chama"
            value={form.apelido}
            onChange={(e) => mudar("apelido", e.target.value)}
            maxLength={30}
            autoComplete="nickname"
          />
        </Campo>

        <Campo id="baralho" rotulo="Baralho" erro={erros.baralho}>
          <Select value={form.baralho} onValueChange={(valor) => mudar("baralho", valor)}>
            <SelectTrigger id="baralho" aria-invalid={erros.baralho ? true : undefined}>
              <SelectValue placeholder={baralhos.isPending ? "Carregando…" : "Escolha"} />
            </SelectTrigger>
            <SelectContent position="popper">
              {baralhos.data?.map((b) => (
                <SelectItem key={b.codigo} value={b.codigo}>
                  {b.descricao}
                  <span className="algarismos text-musgo">{b.cartas.join(" ")}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>
      </div>

      <SeletorPapel valor={form.papel} aoMudar={(papel) => mudar("papel", papel)} />

      <div className="grid gap-3 pt-1">
        <Button type="submit" disabled={criacao.isPending} className="w-full sm:w-fit">
          {criacao.isPending ? "Criando a sala…" : "Criar sala"}
        </Button>
        {criacao.isError && !Object.keys(erros).length && <MensagemErro>{lerErro(criacao.error).mensagem}</MensagemErro>}
      </div>
    </form>
  );
}
