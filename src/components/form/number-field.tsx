"use client";

import { cn } from "cn";
import type { FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { ControlProps, FieldProps } from "@/types/form";

import { FormField } from "./form-field";

type NumberInputProps = ControlProps<typeof Input, "type">;

export type NumberFieldProps<T extends FieldValues> = FieldProps<
  T,
  NumberInputProps
>;

export function NumberField<T extends FieldValues = FieldValues>(
  props: NumberFieldProps<T>,
) {
  return (
    <FormField<T, NumberInputProps>
      {...props}
      render={({
        field,
        ariaProps,
        props: { onChange, onBlur, className, ...inputProps },
      }) => (
        <Input
          inputMode="decimal"
          {...inputProps}
          {...ariaProps}
          {...field}
          type="number"
          className={cn("algarismos", className)}
          value={field.value ?? ""}
          onChange={(event) => {
            onChange?.(event);
            field.onChange(
              event.target.value === "" ? null : event.target.valueAsNumber,
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
