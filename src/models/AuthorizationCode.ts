import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

import { Client } from "./Client";
import { User } from "./User";

@Entity({ name: "authorization_codes" })
export class AuthorizationCode {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  authorizationCode!: string;

  @Column({ type: "timestamp", nullable: false })
  expiresAt!: Date;

  @Column({ type: "text", nullable: false })
  redirectUri!: string;

  @ManyToOne(() => Client, client => client.id)
  client!: Client;

  @ManyToOne(() => User, user => user.id)
  user!: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
