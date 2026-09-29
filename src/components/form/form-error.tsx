"use client";

import { useFormState } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import type { PropsWithout } from "@/types/common";

export function FormError(
  props: PropsWithout<typeof FieldError, "errors" | "children">,
) {
  const { errors } = useFormState();
  return <FieldError errors={[errors.root]} {...props} />;
}
