import env from "@cubos/env";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../types/error";

export function auth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization as string;

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    req.userId = decoded.id;
  } catch {
    throw new BadRequestError("Invalid token");
  }

  return next();
}
