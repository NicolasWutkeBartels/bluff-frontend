"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { FormField } from "@/components/form/form-field";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { useIniciarRodada } from "@/hooks/use-rodada";
import {
  novaRodadaFormSchema,
  type NovaRodadaForm,
} from "@/schemas/rodada.schema";
import type { ParticipanteNaSala } from "@/types/sala";

type Props = ParticipanteNaSala<{ isFirst: boolean }>;

export function FormNovaRodada({ isFirst, ...participante }: Props) {
  const inicio = useIniciarRodada(participante);
  const form = useForm<NovaRodadaForm>({
    resolver: zodResolver(novaRodadaFormSchema),
    defaultValues: { titulo: "" },
  });

  async function enviar({ titulo }: NovaRodadaForm) {
    await inicio.mutateAsync(titulo);
    form.reset();
  }

  return (
    <Form methods={form} onSubmit={enviar} className="grid gap-3">
      <FormField<NovaRodadaForm>
        name="titulo"
        isRequired
        label="O que vamos estimar"
        labelProps={{ className: "sr-only" }}
        fieldProps={{ className: "gap-3" }}
        render={({ field, ariaProps }) => (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              {...field}
              {...ariaProps}
              placeholder={
                isFirst ? "Ex.: tela de login" : "O que vamos estimar agora?"
              }
              maxLength={200}
              autoComplete="off"
              className="sm:max-w-md"
            />
            <SubmitButton labelSaving="Começando…">Começar rodada</SubmitButton>
          </div>
        )}
      />
      <FormError />
    </Form>
  );
}
