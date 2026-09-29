import type { ElementType, ReactNode } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

import type {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import type { PropsWithout } from "./common";

type ControlledKey = "name" | "id" | "value" | "defaultValue" | "disabled";

export type ControlProps<
  C extends ElementType,
  Omitted extends PropertyKey = never,
> = PropsWithout<C, ControlledKey | Omitted>;

export type BaseFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: ReactNode;
  description?: ReactNode;
  id?: string;
  disabled?: boolean;
  isRequired?: boolean;
  fieldProps?: PropsWithout<typeof Field, "children">;
  labelProps?: PropsWithout<typeof FieldLabel, "children" | "htmlFor">;
  descriptionProps?: PropsWithout<typeof FieldDescription, "children">;
  errorProps?: PropsWithout<typeof FieldError, "errors">;
};

export type FieldProps<T extends FieldValues, P = object> = BaseFieldProps<T> &
  P;

export type AriaProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};
