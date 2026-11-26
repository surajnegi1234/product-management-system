import { useCallback, useEffect, useState } from "react";
import { ApiRequestError, getErrorMessage } from "../services/api";
import { getProductById } from "../services/productService";
import { Product } from "../types/product";

export type ProductState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; product: Product }
  | { status: "not-found" }
  | { status: "error"; message: string };

export function useProduct(id: string | undefined): { state: ProductState; retry: () => void } {
  const [state, setState] = useState<ProductState>({ status: id ? "loading" : "idle" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      setState({ status: "idle" });
      return;
    }

    const ctrl = new AbortController();
    setState({ status: "loading" });

    getProductById(id, ctrl.signal)
      .then((p) => setState({ status: "ready", product: p }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        const miss = e instanceof ApiRequestError && (e.status === 404 || e.status === 400);
        setState(miss ? { status: "not-found" } : { status: "error", message: getErrorMessage(e) });
      });

    return () => ctrl.abort();
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((c) => c + 1), []);

  return { state, retry };
}
