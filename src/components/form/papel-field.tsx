"use client";

import type { FieldPath, FieldValues } from "react-hook-form";

import { OPCOES_PAPEL } from "@/constants/participante";

import {
  ToggleGroupField,
  type ToggleGroupFieldProps,
} from "./toggle-group-field";

type Props<T extends FieldValues> = Omit<
  ToggleGroupFieldProps<T>,
  "options" | "name" | "label"
> &
  Partial<Pick<ToggleGroupFieldProps<T>, "name" | "label">>;

export function PapelField<T extends FieldValues = FieldValues>({
  name = "papel" as FieldPath<T>,
  label = "Como você participa",
  ...props
}: Props<T>) {
  return (
    <ToggleGroupField<T>
      name={name}
      label={label}
      options={OPCOES_PAPEL}
      {...props}
    />
  );
}
