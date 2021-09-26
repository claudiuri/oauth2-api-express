import type { Connection, EntityManager } from "typeorm";

// Caso você utilize registerValue ou registerScopedValue na aplicação, defina aqui os tipos dos valores registrados.

module "@cubos/inject" {
  export interface UseTypeMap {
    connection: Connection;
    entityManager: EntityManager;
  }
}
