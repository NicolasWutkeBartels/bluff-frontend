import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { lerErroApi } from "@/services/api-erro";

export function aplicarErrosDaApi<T extends FieldValues>(
  erro: unknown,
  setError: UseFormSetError<T>,
) {
  const campos = Object.entries(lerErroApi(erro).campos ?? {});
  for (const [campo, mensagem] of campos) {
    setError(campo as Path<T>, { type: "server", message: mensagem });
  }
  return campos.length > 0;
}
