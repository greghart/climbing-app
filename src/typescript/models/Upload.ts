import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
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
  s3Key: string;

  @Column()
  s3Bucket: string;

  @Column()
  originalName: string;

}
