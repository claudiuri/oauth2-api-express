import type { Connection, EntityManager } from "typeorm";

// Caso você utilize registerValue ou registerScopedValue na aplicação, defina aqui os tipos dos valores registrados.

module "@cubos/inject" {
  export interface UseTypeMap {
    connection: Connection;
    entityManager: EntityManager;
  }
}

declare global {
  declare namespace Express {
    export interface Request {
      userId: string;
    }
  }
}
