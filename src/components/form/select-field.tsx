"use client";

import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Option, PropsWithout } from "@/types/common";
import type { ControlProps, FieldProps } from "@/types/form";

import { FormField } from "./form-field";

type SelectControlProps = ControlProps<typeof SelectTrigger, "children"> & {
  options: Option[];
  placeholder?: ReactNode;
  selectProps?: ControlProps<typeof Select, "onValueChange">;
  contentProps?: PropsWithout<typeof SelectContent, never>;
  itemProps?: PropsWithout<typeof SelectItem, "value" | "children">;
};

export type SelectFieldProps<T extends FieldValues> = FieldProps<
  T,
  SelectControlProps
>;

export function SelectField<T extends FieldValues = FieldValues>(
  props: SelectFieldProps<T>,
) {
  return (
    <FormField<T, SelectControlProps>
      {...props}
      render={({
        field: { value, onChange, onBlur, ref, ...field },
        ariaProps,
        props: {
          options,
          placeholder,
          selectProps,
          contentProps,
          itemProps,
          onBlur: onTriggerBlur,
          ...triggerProps
        },
      }) => (
        <Select
          {...selectProps}
          {...field}
          value={value ?? ""}
          onValueChange={onChange}
        >
          <SelectTrigger
            {...triggerProps}
            {...ariaProps}
            ref={ref}
            onBlur={(event) => {
              onTriggerBlur?.(event);
              onBlur();
            }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" {...contentProps}>
            <SelectGroup>
              {options.map(({ value: optionValue, label, ...option }) => (
                <SelectItem
                  key={optionValue}
                  value={optionValue}
                  {...option}
                  {...itemProps}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
