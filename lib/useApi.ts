"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    () =>
      api<T>(path).then(
        (result) => {
          setData(result);
          setError(null);
        },
        (e) => setError(e instanceof Error ? e.message : "Erro inesperado"),
      ),
    [path],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, error, reload };
}
