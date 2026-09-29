"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import type { AriaProps, FieldProps } from "@/types/form";

export type FieldRenderProps<T extends FieldValues, P> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  ariaProps: AriaProps;
  labelId: string;
  props: P;
};

export type FormFieldProps<T extends FieldValues, P = object> = FieldProps<
  T,
  P
> & {
  render: (renderProps: FieldRenderProps<T, P>) => ReactNode;
};

export function FormField<T extends FieldValues = FieldValues, P = object>({
  name,
  label,
  description,
  id,
  disabled,
  isRequired,
  fieldProps,
  labelProps,
  descriptionProps,
  errorProps,
  render,
  ...props
}: FormFieldProps<T, P>) {
  const { control } = useFormContext<T>();
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const describedBy = [
          description ? descriptionId : null,
          fieldState.invalid ? errorId : null,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <Field
            data-invalid={fieldState.invalid}
            data-disabled={disabled}
            data-required={isRequired}
            {...fieldProps}
          >
            <FieldLabel id={labelId} htmlFor={fieldId} {...labelProps}>
              {label}
              {isRequired && (
                <span aria-hidden className="-ml-1.5 text-caqui">
                  *
                </span>
              )}
            </FieldLabel>
            {render({
              field,
              fieldState,
              labelId,
              props: props as P,
              ariaProps: {
                id: fieldId,
                "aria-invalid": fieldState.invalid,
                "aria-describedby": describedBy || undefined,
                "aria-required": isRequired,
              },
            })}
            {description && (
              <FieldDescription id={descriptionId} {...descriptionProps}>
                {description}
              </FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError
                id={errorId}
                errors={[fieldState.error]}
                {...errorProps}
              />
            )}
          </Field>
        );
      }}
    />
  );
}
