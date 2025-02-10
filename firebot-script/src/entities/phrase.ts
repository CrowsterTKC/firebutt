import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'phrases' })
export class Phrase {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column({ name: 'original_phrase', type: 'simple-json' })
  originalPhrase!: string[];

  @Column({ name: 'replacement_phrase' })
  replacementPhrase!: string;

  @Column({ name: 'part_of_speech', nullable: true, type: 'varchar' })
  partOfSpeech: string | null = null;

  @Column({ name: 'expires_at', nullable: true, type: 'datetime' })
  expiresAt: Date | null = null;

  @Column({ name: 'created_by_user' })
  createdByUser!: string;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;
}
