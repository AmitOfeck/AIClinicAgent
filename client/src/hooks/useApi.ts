import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UseApiReturn<T, TArgs extends unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, TArgs extends unknown[] = []>(
  apiFunction: (...args: TArgs) => Promise<T>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args: TArgs): Promise<T | null> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await apiFunction(...args);

        if (mountedRef.current) {
          setState({ data, isLoading: false, error: null });
        }

        return data;
      } catch (error) {
        if (mountedRef.current) {
          const err = error instanceof Error ? error : new Error('Unknown error');
          setState({ data: null, isLoading: false, error: err });
        }
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
