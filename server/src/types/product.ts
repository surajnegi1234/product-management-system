export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
}
