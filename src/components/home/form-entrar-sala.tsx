"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { PapelField } from "@/components/form/papel-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { useEntrarNaSala } from "@/hooks/use-sala";
import {
  entrarSalaFormSchema,
  type EntrarSalaForm,
} from "@/schemas/sala.schema";

export function FormEntrarSala() {
  const router = useRouter();
  const entrada = useEntrarNaSala();
  const form = useForm<EntrarSalaForm>({
    resolver: zodResolver(entrarSalaFormSchema),
    defaultValues: { codigo: "", apelido: "", papel: "VOTANTE" },
  });

  async function enviar(dados: EntrarSalaForm) {
    const { codigoSala } = await entrada.mutateAsync(dados);
    router.push(`/sala/${codigoSala}`);
  }

  return (
    <Form methods={form} onSubmit={enviar}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-[9rem_1fr] lg:grid-cols-1 xl:grid-cols-[9rem_1fr]">
          <TextField
            name="codigo"
            isRequired
            label="Código da sala"
            format={(value) => value.toUpperCase()}
            placeholder="K7PX3M"
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
            className="algarismos text-[1.0625rem] font-semibold tracking-[0.12em] font-stretch-85% placeholder:tracking-[0.12em]"
          />
          <TextField
            name="apelido"
            isRequired
            label="Seu apelido"
            placeholder="Como o time te chama"
            maxLength={30}
            autoComplete="nickname"
          />
        </div>

        <PapelField />

        <div className="grid gap-3 pt-1">
          <SubmitButton
            variant="quieto"
            labelSaving="Entrando…"
            className="w-full sm:w-fit"
          >
            Entrar na sala
          </SubmitButton>
          <FormError />
        </div>
      </FieldGroup>
    </Form>
  );
}
