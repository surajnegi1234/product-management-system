const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

interface ErrBody {
  error?: {
    message?: string;
    details?: Record<string, string>;
  };
}

export class ApiRequestError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}

async function send(path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiRequestError("Server unreachable", 0);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrBody | null;
    throw new ApiRequestError(
      body?.error?.message ?? "Request failed",
      res.status,
      body?.error?.details
    );
  }
  return res;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await send(path, init);
  return res.json() as Promise<T>;
}

export async function requestNoContent(path: string, init?: RequestInit): Promise<void> {
  await send(path, init);
}
