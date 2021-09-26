import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

import { Client } from "./Client";
import { User } from "./User";

@Entity({ name: "tokes" })
export class Token {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  accessToken!: string;

  @Column({ type: "timestamp", nullable: false })
  accessTokenExpiresAt!: Date;

  @ManyToOne(() => Client, client => client.id)
  client!: Client;

  @ManyToOne(() => User, user => user.id)
  user!: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
