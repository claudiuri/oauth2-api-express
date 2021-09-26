import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  email!: string;

  @Column({ type: "text", nullable: false })
  password!: string;

  @CreateDateColumn({ type: "date" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "date" })
  updatedAt!: Date;
}
