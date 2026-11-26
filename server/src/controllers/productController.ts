import { Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import * as prodService from "../services/productService";
import { parseProductInput } from "../utils/productValidation";

function parseProductId(rawId: string): number {
  if (!/^\d+$/.test(rawId) || Number(rawId) === 0) {
    throw new ApiError(400, "Invalid product ID");
  }
  return Number(rawId);
}

function notFound(id: number): ApiError {
  return new ApiError(404, "Product not found: " + id);
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const products = await prodService.findProducts(search);
  res.json(products);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const id = parseProductId(req.params.id);
  const product = await prodService.findProductById(id);
  if (!product) throw notFound(id);
  res.json(product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const input = parseProductInput(req.body);
  const product = await prodService.createProduct(input);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const id = parseProductId(req.params.id);
  const input = parseProductInput(req.body);
  const product = await prodService.updateProduct(id, input);
  if (!product) throw notFound(id);
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const id = parseProductId(req.params.id);
  const deleted = await prodService.deleteProduct(id);
  if (!deleted) throw notFound(id);
  res.status(204).send();
}
