import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column({ name: 'firebot_id' })
  firebotId!: string;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column()
  type!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;
}
