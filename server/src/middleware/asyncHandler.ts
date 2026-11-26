import { NextFunction, Request, RequestHandler, Response } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: Handler): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
