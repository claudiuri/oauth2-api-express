import { registerValue } from "@cubos/inject";
import { createConnection, getConnectionOptions } from "typeorm";

import app from "./app";
import "./services";

const port = process.env.PORT ?? 9999;

getConnectionOptions()
  .then(async options =>
    createConnection({
      ...options,
      migrationsRun: true,
    }),
  )
  .then(connection => {
    registerValue("connection", connection);
    registerValue("entityManager", connection.createEntityManager());

    return app.listen(port, () => console.log(`Running on http://localhost:${port}`));
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
