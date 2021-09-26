import { registerServiceWithFactory, use } from "@cubos/inject";

import { UserRepository, AuthorizationCodeRepository, ClientRepository, TokenRepository } from "./repositories";

registerServiceWithFactory("scoped", AuthorizationCodeRepository, () =>
  use.entityManager.getCustomRepository(AuthorizationCodeRepository),
);
registerServiceWithFactory("scoped", ClientRepository, () => use.entityManager.getCustomRepository(ClientRepository));
registerServiceWithFactory("scoped", TokenRepository, () => use.entityManager.getCustomRepository(TokenRepository));
registerServiceWithFactory("scoped", UserRepository, () => use.entityManager.getCustomRepository(UserRepository));
