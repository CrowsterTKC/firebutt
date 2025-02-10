import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usage_statistics' })
export class UsageStatistic {
  @PrimaryColumn()
  id!: string;

  @Column()
  guid!: string;

  @Column({ name: 'original_phrase' })
  originalPhrase!: string;

  @Column({ name: 'replacement_phrase' })
  replacementPhrase!: string;

  @Column()
  user!: string;

  @Column({ name: 'original_message' })
  originalMessage!: string;

  @Column({ name: 'replacement_message' })
  replacementMessage!: string;

  @Column({ name: 'stream_title' })
  streamTitle!: string;

  @Column({ name: 'response_probability' })
  responseProbability!: number;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
