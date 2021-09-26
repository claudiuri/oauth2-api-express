import { setupScope } from "@cubos/inject";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth";

const app = express();

app.use(cors());

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use((_req, _res, next) => {
  setupScope(() => {
    return next();
  });
});

app.use(authRoutes);

export default app;
