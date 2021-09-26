/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { authorizeClient, getAuthorizationPage, getToken } from "../controllers/auth";

const routes = Router();

routes.get("/oauth", getAuthorizationPage);
routes.post("/oauth/authorize", authorizeClient);
routes.post("/oauth/access_token", getToken);

export default routes;
