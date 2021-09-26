import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "clients" })
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", nullable: false })
  clientId!: string;

  @Column({ type: "text", nullable: false })
  clientSecret!: string;

  @Column({ type: "text", nullable: false })
  dataUris!: string;

  @Column({ type: "text", nullable: false })
  grants!: string;

  @CreateDateColumn({ type: "date" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "date" })
  updatedAt!: Date;
}
