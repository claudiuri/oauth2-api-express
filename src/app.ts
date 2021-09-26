import { setupScope } from "@cubos/inject";
import cors from "cors";
import express from "express";

import { globalErrorHandler, urlNotFoundHandler } from "./controllers/error";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();

app.use(cors());

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use((_req, _res, next) => {
  setupScope(() => {
    return next();
  });
});

app.use(express.static(`${__dirname}/public`));

app.use(authRoutes);
app.use(userRoutes);

app.use(urlNotFoundHandler);
app.use(globalErrorHandler);

export default app;
