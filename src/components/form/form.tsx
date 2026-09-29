"use client";

import type { ComponentProps } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

import { aplicarErrosDaApi } from "@/lib/formulario";
import { lerErroApi } from "@/services/api-erro";

type Props<T extends FieldValues, TSaida> = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  methods: UseFormReturn<T, unknown, TSaida>;
  onSubmit: (dados: TSaida) => unknown;
};

export function Form<T extends FieldValues, TSaida = T>({
  methods,
  onSubmit,
  noValidate = true,
  children,
  ...props
}: Props<T, TSaida>) {
  async function enviar(dados: TSaida) {
    try {
      await onSubmit(dados);
    } catch (erro) {
      if (!aplicarErrosDaApi(erro, methods.setError)) {
        methods.setError("root", { message: lerErroApi(erro).mensagem });
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        noValidate={noValidate}
        onSubmit={methods.handleSubmit(enviar)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
