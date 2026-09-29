"use client";

import type { FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { ControlProps, FieldProps } from "@/types/form";

import { FormField } from "./form-field";

type TextInputProps = ControlProps<typeof Input> & {
  format?: (value: string) => string;
};

export type TextFieldProps<T extends FieldValues> = FieldProps<
  T,
  TextInputProps
>;

export function TextField<T extends FieldValues = FieldValues>(
  props: TextFieldProps<T>,
) {
  return (
    <FormField<T, TextInputProps>
      {...props}
      render={({
        field,
        ariaProps,
        props: { format, onChange, onBlur, ...inputProps },
      }) => (
        <Input
          {...inputProps}
          {...ariaProps}
          {...field}
          value={field.value ?? ""}
          onChange={(event) => {
            onChange?.(event);
            field.onChange(
              format ? format(event.target.value) : event.target.value,
            );
          }}
          onBlur={(event) => {
            onBlur?.(event);
            field.onBlur();
          }}
        />
      )}
    />
  );
}
