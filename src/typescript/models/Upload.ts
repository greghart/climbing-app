import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { cascadeManyToOne, cascadeOneToMany } from '../db/cascadeOptions';
import Comment from './Comment';

/**
 * Uploads
 *
 * Uploads in the system.
 */
@Entity()
export default class Upload {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  s3_key: string;

  @Column()
  s3_bucket: string;

  @Column()
  original_name: string;

}
