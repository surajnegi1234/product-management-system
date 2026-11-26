import { Product, ProductPayload } from "../types/product";
import { requestJson, requestNoContent } from "./api";

export function getProducts(search: string, signal?: AbortSignal): Promise<Product[]> {
  const q = search.trim();
  const qs = q ? "?search=" + encodeURIComponent(q) : "";
  return requestJson<Product[]>("/products" + qs, { signal });
}

export function getProductById(id: string | number, signal?: AbortSignal): Promise<Product> {
  return requestJson<Product>("/products/" + id, { signal });
}

export function createProduct(payload: ProductPayload): Promise<Product> {
  return requestJson<Product>("/products", { method: "POST", body: JSON.stringify(payload) });
}

export function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  return requestJson<Product>("/products/" + id, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteProduct(id: number): Promise<void> {
  return requestNoContent("/products/" + id, { method: "DELETE" });
}
