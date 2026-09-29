"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormState } from "react-hook-form";

import { Button } from "@/components/ui/button";

type Props = ComponentProps<typeof Button> & {
  labelSaving?: ReactNode;
};

export function SubmitButton({
  labelSaving,
  disabled,
  children,
  ...props
}: Props) {
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={disabled || isSubmitting} {...props}>
      {isSubmitting && labelSaving ? labelSaving : children}
    </Button>
  );
}
