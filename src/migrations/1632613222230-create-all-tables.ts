import {MigrationInterface, QueryRunner} from "typeorm";

export class createAllTables1632613222230 implements MigrationInterface {
    name = 'createAllTables1632613222230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "client_secret" text NOT NULL, "data_uris" text NOT NULL, "grants" text NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "authorization_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorization_code" text NOT NULL, "expires_at" date NOT NULL, "redirect_uri" text NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), "client_id" uuid, "user_id" uuid, CONSTRAINT "PK_f05b2eb99ad2db12d87544656c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" text NOT NULL, "access_token_expires_at" text NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), "client_id" uuid, "user_id" uuid, CONSTRAINT "PK_ba2a8afaa446dc4119c6fd35ba0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "authorization_codes" ADD CONSTRAINT "FK_9b6780f6c2ce73987f7cabb4ae3" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authorization_codes" ADD CONSTRAINT "FK_68f8ccfda6bb17fb159cc965cce" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokes" ADD CONSTRAINT "FK_98ade8f97444c8f9454ba304c61" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokes" ADD CONSTRAINT "FK_b93cea511102b73cac14f30f69b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokes" DROP CONSTRAINT "FK_b93cea511102b73cac14f30f69b"`);
        await queryRunner.query(`ALTER TABLE "tokes" DROP CONSTRAINT "FK_98ade8f97444c8f9454ba304c61"`);
        await queryRunner.query(`ALTER TABLE "authorization_codes" DROP CONSTRAINT "FK_68f8ccfda6bb17fb159cc965cce"`);
        await queryRunner.query(`ALTER TABLE "authorization_codes" DROP CONSTRAINT "FK_9b6780f6c2ce73987f7cabb4ae3"`);
        await queryRunner.query(`DROP TABLE "tokes"`);
        await queryRunner.query(`DROP TABLE "authorization_codes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
