/* eslint-disable @typescript-eslint/naming-convention */
import crypto from "crypto";
import path from "path";

import env from "@cubos/env";
import { use } from "@cubos/inject";
import { add } from "date-fns";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthorizationCodeRepository, ClientRepository, TokenRepository, UserRepository } from "../repositories";

export async function getAuthorizationPage(req: Request, res: Response) {
  const { client_id, redirect_uri } = req.query;

  if (!client_id) {
    return res.status(400).send({ error: "Send client_id" });
  }

  if (!redirect_uri) {
    return res.status(400).send({ error: "Send redirect_uri" });
  }

  const client = await use(ClientRepository).findOne({ clientId: client_id as string });

  if (!client) {
    return res.status(404).send({ error: "Not foun client" });
  }

  if (client.dataUris !== (redirect_uri as string)) {
    return res.status(400).send({ error: "Invalid uri" });
  }

  const filePath = path.join(__dirname, "../public/oauthAuthenticate.html");

  return res.sendFile(filePath);
}

export async function authorizeClient(req: Request, res: Response) {
  const { email, password, client_id, redirect_uri } = req.body as {
    email: string;
    password: string;
    client_id: string;
    redirect_uri: string;
  };

  if (!email || !password) {
    return res.status(400).send({ error: "" });
  }

  const user = await use(UserRepository).findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "Not foun user" });
  }

  const client = await use(ClientRepository).findOne({ clientId: client_id });

  if (!client) {
    return res.status(404).send({ error: "Not foun client" });
  }

  if (client.dataUris !== redirect_uri) {
    return res.status(400).send({ error: "Invalid uri" });
  }

  const seed = crypto.randomBytes(256);

  const code = crypto.createHash("sha1").update(seed).digest("hex");

  await use(AuthorizationCodeRepository).insert({ client, user, expiresAt: new Date(), authorizationCode: code });

  return res.redirect(`${redirect_uri}?client_id=${client_id}&client_secret=${client.clientSecret}&code=${code}`);
}

export async function getToken(req: Request, res: Response) {
  const { code, client_id, client_secret } = req.body as { code: string; client_id: string; client_secret: string };

  const authorizationCode = await use(AuthorizationCodeRepository).findOne(
    {
      authorizationCode: code,
      client: { id: client_id, clientSecret: client_secret },
    },
    { relations: ["user", "client"] },
  );

  if (!authorizationCode) {
    return res.status(404).send({ error: "Not foun authorization code" });
  }

  const token = jwt.sign({ id: authorizationCode.user.id }, env.JWT_SECRET, { expiresIn: "1h" });

  await use(TokenRepository).insert({
    client: authorizationCode.client,
    user: authorizationCode.user,
    accessToken: token,
    accessTokenExpiresAt: add(new Date(), { hours: 1 }),
  });

  return res.status(200).send({ access_token: token, expires_in: 3600, token_type: "Bearer" });
}
