// entities/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    email!: string;
  
    @Column({ nullable: true })
    name!: string;
  
    @Column({ nullable: true })
    password!: string; // Hash passwords before saving them
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  