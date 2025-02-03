//@ts-nocheck

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 255 })
  paymentStatus!: string;

  @Column({ type: 'varchar', length: 255 })
  startTime!: string;

  @Column({ type: 'varchar', length: 255 })
  endTime!: string;

  @Column({ type: 'varchar', length: 255 })
  userName!: string;

  @Column({ type: 'varchar', length: 255 })
  userEmail!: string;

  @Column({ type: 'varchar', length: 255 })
  userLocation!: string;

  @Column({ type: 'varchar', length: 255 })
  phoneNumber!: string;

  @Column({ type: 'bigint' })
  amount!: number; // Changed from string to number

  @Column({ type: 'bigint' })
  peopleCount!: number; // Changed from string to number
  
  @Column({ type: 'varchar', length: 255 })
  orderId!: string;
}