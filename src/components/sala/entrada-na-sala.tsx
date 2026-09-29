"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { VersoCarta } from "@/components/carta/verso-carta";
import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { PapelField } from "@/components/form/papel-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Logo } from "@/components/marca/logo";
import { FieldGroup } from "@/components/ui/field";
import { useEntrarNaSala } from "@/hooks/use-sala";
import type { Sessao } from "@/lib/sessao";
import {
  entrarPorConviteFormSchema,
  type EntrarPorConviteForm,
} from "@/schemas/sala.schema";
import type { Handler } from "@/types/common";

type Props = {
  codigo: string;
  nome: string;
  onEnter: Handler<Sessao>;
};

export function EntradaNaSala({ codigo, nome, onEnter }: Props) {
  const entrada = useEntrarNaSala();
  const form = useForm<EntrarPorConviteForm>({
    resolver: zodResolver(entrarPorConviteFormSchema),
    defaultValues: { apelido: "", papel: "VOTANTE" },
  });

  async function enviar(dados: EntrarPorConviteForm) {
    const { participante } = await entrada.mutateAsync({ codigo, ...dados });
    onEnter({
      participanteId: participante.id,
      apelido: participante.apelido,
    });
  }

  return (
    <main className="mx-auto grid w-full max-w-280 gap-16 px-6 pt-8 pb-24 sm:px-12">
      <header>
        <Logo />
      </header>
      <section className="grid max-w-md gap-10">
        <div className="flex items-end gap-5">
          <VersoCarta seed={codigo} size="mesa" />
          <div className="grid gap-1.5 pb-1">
            <p className="text-[0.8125rem] text-musgo">
              Você foi convidado para
            </p>
            <h1 className="text-3xl leading-tight font-[650] tracking-tight font-stretch-90%">
              {nome}
            </h1>
          </div>
        </div>
        <Form methods={form} onSubmit={enviar}>
          <FieldGroup>
            <TextField
              name="apelido"
              isRequired
              label="Seu apelido"
              placeholder="Como o time te chama"
              maxLength={30}
              autoComplete="nickname"
              autoFocus
            />
            <PapelField />
            <div className="grid gap-3 pt-1">
              <SubmitButton labelSaving="Entrando…" className="w-full sm:w-fit">
                Entrar na sala
              </SubmitButton>
              <FormError />
            </div>
          </FieldGroup>
        </Form>
      </section>
    </main>
  );
}
