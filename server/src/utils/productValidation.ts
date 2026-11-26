import { ApiError } from "../errors/ApiError";
import { ProductInput } from "../types/product";

const LIMITS = {
  nameLen: 150,
  descLen: 2000,
  catLen: 100,
  maxPrice: 99999999.99,
  maxQty: 2147483647,
};

type ErrMap = Record<string, string>;

function isObj(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseText(value: unknown, field: string, maxLen: number, errors: ErrMap): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    errors[field] = field + " must be text";
    return null;
  }
  const t = value.trim();
  if (t.length > maxLen) {
    errors[field] = field + " too long";
  }
  return t === "" ? null : t;
}

function parsePrice(value: unknown, errors: ErrMap): number {
  if (value === undefined || value === null || value === "") {
    errors.price = "Price required";
    return 0;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.price = "Price must be numeric";
    return 0;
  }
  if (value < 0) {
    errors.price = "Price negative";
  } else if (value > LIMITS.maxPrice) {
    errors.price = "Price too high";
  } else if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-6) {
    errors.price = "Max 2 decimals";
  }
  return value;
}

function parseQty(value: unknown, errors: ErrMap): number {
  if (value === undefined || value === null || value === "") {
    errors.quantity = "Qty required";
    return 0;
  }
  if (typeof value !== "number" || !Number.isInteger(value)) {
    errors.quantity = "Qty must be integer";
    return 0;
  }
  if (value < 0) {
    errors.quantity = "Qty negative";
  } else if (value > LIMITS.maxQty) {
    errors.quantity = "Qty too high";
  }
  return value;
}

export function parseProductInput(body: unknown): ProductInput {
  const errors: ErrMap = {};
  const data: Record<string, unknown> = isObj(body) ? body : {};

  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (name === "") {
    errors.name = "Name required";
  } else if (name.length > LIMITS.nameLen) {
    errors.name = "Name too long";
  }

  const description = parseText(data.description, "description", LIMITS.descLen, errors);
  const category = parseText(data.category, "category", LIMITS.catLen, errors);
  const price = parsePrice(data.price, errors);
  const quantity = parseQty(data.quantity, errors);

  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Bad input", errors);
  }

  return { name, description, price, quantity, category };
}
