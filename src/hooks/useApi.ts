// ============================================================
// Custom API Hook — useApi
// Reusable hook for API calls with loading, error states
// ============================================================

import { useState, useCallback } from 'react';
import { ApiError } from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    validationErrors: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState({
        data: null,
        loading: true,
        error: null,
        validationErrors: null,
      });

      try {
        const result = await apiFunction(...args);
        setState({
          data: result,
          loading: false,
          error: null,
          validationErrors: null,
        });
        return result;
      } catch (err) {
        let errorMessage = 'An unexpected error occurred';
        let validationErrors = null;

        if (err instanceof ApiError) {
          errorMessage = err.message;
          validationErrors = err.errors || null;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          validationErrors,
        });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      validationErrors: null,
    });
  }, []);

  return { ...state, execute, reset };
}

export default useApi;
