import { EntityRepository, Repository } from "typeorm";

import { AuthorizationCode } from "../models";

@EntityRepository(AuthorizationCode)
export class AuthorizationCodeRepository extends Repository<AuthorizationCode> {}
