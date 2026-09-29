"use client";

import { cn } from "cn";
import type { FieldValues } from "react-hook-form";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Option, PropsWithout, WithClassName } from "@/types/common";
import type { FieldProps } from "@/types/form";

import { FormField } from "./form-field";

type ToggleGroupControlProps = WithClassName<{
  options: Option[];
  itemProps?: PropsWithout<typeof ToggleGroupItem, "value" | "children">;
  spacing?: number;
  orientation?: "horizontal" | "vertical";
}>;

export type ToggleGroupFieldProps<T extends FieldValues> = FieldProps<
  T,
  ToggleGroupControlProps
>;

export function ToggleGroupField<T extends FieldValues = FieldValues>(
  props: ToggleGroupFieldProps<T>,
) {
  return (
    <FormField<T, ToggleGroupControlProps>
      {...props}
      render={({
        field: { value, onChange, ...field },
        ariaProps,
        labelId,
        props: { options, className, itemProps, spacing = 0, ...groupProps },
      }) => (
        <ToggleGroup
          {...groupProps}
          {...ariaProps}
          {...field}
          type="single"
          value={value ?? ""}
          onValueChange={(newValue) => newValue && onChange(newValue)}
          aria-labelledby={labelId}
          spacing={spacing}
          className={cn("w-full rounded-controle bg-nanquim/5 p-1", className)}
        >
          {options.map(({ value: optionValue, label, ...option }) => (
            <ToggleGroupItem
              key={optionValue}
              value={optionValue}
              {...option}
              {...itemProps}
              className={cn(
                "h-9 flex-1 rounded-[0.4375rem]! px-3 text-sm text-musgo transition-colors duration-150 ease-suave hover:bg-transparent hover:text-nanquim data-[state=on]:bg-papel data-[state=on]:text-nanquim",
                itemProps?.className,
              )}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    />
  );
}
