import { Product, ProductFormErrors, ProductFormValues, ProductPayload } from "../types/product";

const L = {
  nameLen: 150,
  descLen: 2000,
  catLen: 100,
  maxP: 99999999.99,
  maxQ: 2147483647,
};

export const emptyFormValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
};

export function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    quantity: String(product.quantity),
    category: product.category ?? "",
  };
}

function chkPrice(t: string): string | undefined {
  if (t === "") return "Enter price";
  const p = Number(t);
  if (!Number.isFinite(p)) return "Price must be number";
  if (p < 0) return "Price negative";
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return "Max 2 decimals";
  if (p > L.maxP) return "Price too big";
  return undefined;
}

function chkQty(t: string): string | undefined {
  if (t === "") return "Enter qty";
  const q = Number(t);
  if (!Number.isFinite(q)) return "Qty must be number";
  if (q < 0) return "Qty negative";
  if (!Number.isInteger(q)) return "Qty integer";
  if (q > L.maxQ) return "Qty too big";
  return undefined;
}

export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const e: ProductFormErrors = {};
  const n = values.name.trim();

  if (n === "") {
    e.name = "Name required";
  } else if (n.length > L.nameLen) {
    e.name = "Name too long";
  }

  if (values.description.trim().length > L.descLen) {
    e.description = "Desc too long";
  }
  if (values.category.trim().length > L.catLen) {
    e.category = "Cat too long";
  }

  const pe = chkPrice(values.price.trim());
  if (pe) e.price = pe;

  const qe = chkQty(values.quantity.trim());
  if (qe) e.quantity = qe;

  return e;
}

export function toPayload(values: ProductFormValues): ProductPayload {
  return {
    name: values.name.trim(),
    description: values.description.trim() || null,
    price: Number(values.price),
    quantity: Number(values.quantity),
    category: values.category.trim() || null,
  };
}
