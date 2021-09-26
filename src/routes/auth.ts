/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { getAuthorizationPage } from "../controllers/auth";

const routes = Router();

routes.get("/oauth", getAuthorizationPage);

export default routes;
