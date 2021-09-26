/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

import { createUser, getCurrentUser } from "../controllers/user";
import { auth } from "../middlewares/auth";

const routes = Router();

routes.post("/users", createUser);
routes.get("/user", auth, getCurrentUser);

export default routes;
