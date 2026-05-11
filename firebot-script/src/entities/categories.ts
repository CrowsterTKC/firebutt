import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Phrase } from './phrase';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column()
  name!: string;

  @Column({ name: 'is_enabled', default: true })
  isEnabled!: boolean;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;

  @OneToMany(() => Phrase, (phrase) => phrase.category, {
    cascade: true,
  })
  phrases!: Phrase[];

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;
}
