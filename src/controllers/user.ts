import { use } from "@cubos/inject";
import { genSalt, hash } from "bcrypt";
import type { Request, Response } from "express";

import { UserRepository } from "../repositories";

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  const userExists = await use(UserRepository).findOne({ email });

  if (userExists) {
    return res.status(404).send({ error: "Emails is being used." });
  }

  const passwordHashed = await hash(password, await genSalt());

  const userCreated = await use(UserRepository).save({ name, email, password: passwordHashed });

  return res.status(201).send(userCreated);
}

export async function getCurrentUser(req: Request, res: Response) {
  const user = await use(UserRepository).findOne({ id: req.userId });

  if (!user) {
    return res.status(404).send({ error: "Not found user" });
  }

  return res.status(200).send({ id: user.id, name: user.name, email: user.email });
}
