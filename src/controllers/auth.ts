/* eslint-disable @typescript-eslint/naming-convention */
import crypto from "crypto";

import env from "@cubos/env";
import { use } from "@cubos/inject";
import { compare } from "bcrypt";
import { add, differenceInMinutes } from "date-fns";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthorizationCodeRepository, ClientRepository, TokenRepository, UserRepository } from "../repositories";
import { BadRequestError, NotFoundError } from "../types/error";

export async function getAuthorizationPage(req: Request, res: Response) {
  const { client_id, redirect_uri, state } = req.query as { client_id: string; redirect_uri: string; state: string };

  if (!client_id) {
    throw new BadRequestError("Send client_id");
  }

  if (!redirect_uri) {
    throw new BadRequestError("Send redirect_uri");
  }

  const client = await use(ClientRepository).findOne({ clientId: client_id });

  if (!client) {
    throw new NotFoundError("Not foun client");
  }

  if (!redirect_uri.includes(client.dataUris)) {
    throw new BadRequestError("Invalid uri");
  }

  return res.redirect(`/oauthAuthenticate.html?client_id=${client_id}&start=${state}&redirect_uri=${redirect_uri}`);
}

export async function authorizeClient(req: Request, res: Response) {
  const { email, password, client_id, redirect_uri, state } = req.body as {
    email: string;
    password: string;
    client_id: string;
    redirect_uri: string;
    state: string;
  };

  if (!email || !password) {
    throw new BadRequestError("Provide the email and password");
  }

  const user = await use(UserRepository).findOne({ email });

  if (!user) {
    throw new BadRequestError("email or password invalid");
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    throw new BadRequestError("email or password invalid");
  }

  const client = await use(ClientRepository).findOne({ clientId: client_id });

  if (!client) {
    throw new NotFoundError("Not found client");
  }

  if (!redirect_uri.includes(client.dataUris)) {
    throw new BadRequestError("Invalid uri");
  }

  const seed = crypto.randomBytes(256);

  const code = crypto.createHash("sha1").update(seed).digest("hex");

  await use(AuthorizationCodeRepository).insert({
    client,
    user,
    expiresAt: add(new Date(), { minutes: 10 }),
    authorizationCode: code,
    redirectUri: redirect_uri,
  });

  return res.redirect(
    `${redirect_uri}?client_id=${client_id}&client_secret=${client.clientSecret}&code=${code}&state=${state}`,
  );
}

export async function getToken(req: Request, res: Response) {
  const { code, client_id, client_secret } = req.query as { code: string; client_id: string; client_secret: string };

  const authorizationCode = await use(AuthorizationCodeRepository).findOne(
    {
      authorizationCode: code,
      client: { clientId: client_id, clientSecret: client_secret },
    },
    { relations: ["user", "client"] },
  );

  if (!authorizationCode) {
    throw new NotFoundError("Not foun authorization code");
  }

  const now = new Date();

  const diffMinutes = differenceInMinutes(now, authorizationCode.expiresAt);

  if (!diffMinutes) {
    throw new BadRequestError("Codee expired");
  }

  const token = jwt.sign({ id: authorizationCode.user.id }, env.JWT_SECRET, { expiresIn: "1h" });

  await use(TokenRepository).insert({
    client: authorizationCode.client,
    user: authorizationCode.user,
    accessToken: token,
    accessTokenExpiresAt: add(now, { hours: 1 }),
  });

  return res.status(200).send({ access_token: token, expires_in: 3600, token_type: "Bearer" });
}
