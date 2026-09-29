"use client";

import type { FieldValues } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import type { ControlProps, FieldProps } from "@/types/form";

import { FormField } from "./form-field";

type TextareaProps = ControlProps<typeof Textarea>;

export type TextareaFieldProps<T extends FieldValues> = FieldProps<
  T,
  TextareaProps
>;

export function TextareaField<T extends FieldValues = FieldValues>(
  props: TextareaFieldProps<T>,
) {
  return (
    <FormField<T, TextareaProps>
      {...props}
      render={({
        field,
        ariaProps,
        props: { onChange, onBlur, ...textareaProps },
      }) => (
        <Textarea
          {...textareaProps}
          {...ariaProps}
          {...field}
          value={field.value ?? ""}
          onChange={(event) => {
            onChange?.(event);
            field.onChange(event.target.value);
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
