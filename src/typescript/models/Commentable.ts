import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';

import Comment from './Comment';
import { cascadeOneToMany } from '../db/cascadeOptions';

/**
 * Commentable supertable to model polymorphic comment associations
 */
@Entity()
export default class Commentable {
  @PrimaryGeneratedColumn()
  id: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup for comments
  @Column()
  descriptor: string;

  @OneToMany(type => Comment, comment => comment.commentable, cascadeOneToMany)
  comments: Comment[];

}

