export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
  createdAt: string;
}

export interface ProductPayload {
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;
