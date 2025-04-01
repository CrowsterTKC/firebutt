import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VirtualColumn,
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

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("usage_statistics"."id") usage_count FROM usage_statistics RIGHT JOIN phrases "pj" ON (usage_statistics.metadata->>'phrase_id' = "pj".id) WHERE "pj".original_phrase = ${alias}.original_phrase GROUP BY "pj".original_phrase`,
  })
  usageCount!: number;

  @Column({ name: 'metadata', type: 'json' })
  metadata!: {
    default?: boolean;
    imported?: boolean;
    twitchAvatarUrl?: string;
    twitchUserId?: string;
    twitchUsername?: string;
  };

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null = null;
}
