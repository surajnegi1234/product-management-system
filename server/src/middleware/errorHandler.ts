import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, "404: " + req.method + " " + req.originalUrl));
}

function isJsonError(error: unknown): boolean {
  return error instanceof SyntaxError && "body" in error;
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ error: { message: error.message, details: error.details } });
    return;
  }

  if (isJsonError(error)) {
    res.status(400).json({ error: { message: "Invalid JSON" } });
    return;
  }

  console.error("Error:", error);
  res.status(500).json({ error: { message: "Server error" } });
}
