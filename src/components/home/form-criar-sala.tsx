"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { PapelField } from "@/components/form/papel-field";
import { SelectField } from "@/components/form/select-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { FieldGroup } from "@/components/ui/field";
import { useBaralhos } from "@/hooks/use-baralhos";
import { useCriarSala } from "@/hooks/use-sala";
import { criarSalaFormSchema, type CriarSalaForm } from "@/schemas/sala.schema";

export function FormCriarSala() {
  const router = useRouter();
  const baralhos = useBaralhos();
  const criacao = useCriarSala();
  const form = useForm<CriarSalaForm>({
    resolver: zodResolver(criarSalaFormSchema),
    defaultValues: {
      nomeSala: "",
      apelido: "",
      baralho: "FIBONACCI",
      papel: "VOTANTE",
    },
  });

  const opcoesDeBaralho = (baralhos.data ?? []).map((baralho) => ({
    value: baralho.codigo,
    label: (
      <>
        {baralho.descricao}
        <span className="algarismos text-musgo">
          {baralho.cartas.join(" ")}
        </span>
      </>
    ),
  }));

  async function enviar(dados: CriarSalaForm) {
    const { codigoSala } = await criacao.mutateAsync(dados);
    router.push(`/sala/${codigoSala}`);
  }

  return (
    <Form methods={form} onSubmit={enviar}>
      <FieldGroup>
        <TextField
          name="nomeSala"
          isRequired
          label="Nome da sala"
          placeholder="Time Azul, sprint 42"
          maxLength={80}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="apelido"
            isRequired
            label="Seu apelido"
            placeholder="Como o time te chama"
            maxLength={30}
            autoComplete="nickname"
          />
          <SelectField
            name="baralho"
            isRequired
            label="Baralho"
            options={opcoesDeBaralho}
            placeholder={baralhos.isPending ? "Carregando…" : "Escolha"}
          />
        </div>

        <PapelField />

        <div className="grid gap-3 pt-1">
          <SubmitButton
            labelSaving="Criando a sala…"
            className="w-full sm:w-fit"
          >
            Criar sala
          </SubmitButton>
          <FormError />
        </div>
      </FieldGroup>
    </Form>
  );
}
