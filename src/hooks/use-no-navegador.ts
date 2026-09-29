"use client";

import { useSyncExternalStore } from "react";

const nadaAssinar = () => () => {};

export function useNoNavegador() {
  return useSyncExternalStore(
    nadaAssinar,
    () => true,
    () => false,
  );
}
