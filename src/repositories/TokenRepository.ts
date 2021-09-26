import { EntityRepository, Repository } from "typeorm";

import { Token } from "../models";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}
