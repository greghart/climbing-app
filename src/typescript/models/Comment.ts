import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

import Commentable from './Commentable';
import User from './User';
import { cascadeManyToOne } from '../db/cascadeOptions';

/**
 * Comment subtable
 * Each comment should belong to just one commentable, so we just model that easily.
 * Then each commentable can then be related to an actual entity (route, boulder, etc.)
 */
@Entity()
export default class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup for comments
  @ManyToOne(type => Commentable, commentable => commentable.comments, cascadeManyToOne)
  commentable: Commentable;

  @ManyToOne(type => User, user => user.comments, cascadeManyToOne)
  user: User;

}

