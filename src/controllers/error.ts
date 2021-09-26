import type { NextFunction, Request, Response } from "express";

import { ApiError, NotFoundError } from "../types/error";

export function globalErrorHandler(
  error: Error & Partial<ApiError>,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error.statusCode ?? 500;

  if (error instanceof ApiError) {
    return res.status(statusCode).json({ type: error.name, error: error.message });
  }

  return res.status(statusCode).json({ type: Error.name, error: "Erro ao processar requisição" });
}

export function urlNotFoundHandler(req: Request, _res: Response) {
  throw new NotFoundError(`Can't find ${req.url} on this server`);
}
