import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../config/database";
import { Product, ProductInput } from "../types/product";

interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  quantity: number;
  category: string | null;
  created_at: Date;
}

const COLS = "id, name, description, price, quantity, category, created_at";

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    quantity: row.quantity,
    category: row.category,
    createdAt: row.created_at.toISOString(),
  };
}

function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, "\\$&");
}

export async function findProducts(search?: string): Promise<Product[]> {
  const term = search?.trim() ?? "";
  const where = term === "" ? "" : "WHERE name LIKE ?";
  const params = term === "" ? [] : [`%${escapeLike(term)}%`];

  const [rows] = await pool.execute<ProductRow[]>(
    `SELECT ${COLS} FROM products ${where} ORDER BY created_at DESC, id DESC`,
    params
  );
  return rows.map(mapRow);
}

export async function findProductById(id: number): Promise<Product | null> {
  const [rows] = await pool.execute<ProductRow[]>(
    `SELECT ${COLS} FROM products WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)",
    [input.name, input.description, input.price, input.quantity, input.category]
  );

  const created = await findProductById(result.insertId);
  if (!created) {
    throw new Error("Insert failed");
  }
  return created;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product | null> {
  await pool.execute<ResultSetHeader>(
    "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?",
    [input.name, input.description, input.price, input.quantity, input.category, id]
  );
  return findProductById(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
