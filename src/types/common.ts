import type { ComponentProps, ElementType, ReactNode } from "react";

export type Nullable<T> = T | null;

export type Handler<T = void> = [T] extends [void]
  ? () => void
  : (value: T) => void;

export type WithClassName<P = object> = P & { className?: string };

export type PropsWithout<C extends ElementType, K extends PropertyKey> = Omit<
  ComponentProps<C>,
  K
>;

export type Option<V extends string = string> = {
  value: V;
  label: ReactNode;
  disabled?: boolean;
};
