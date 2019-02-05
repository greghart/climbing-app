import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

import Commentable from './Commentable';
import User from './User';
import Timestamps from './Timestamps';
import { cascadeManyToOne } from '../db/cascadeOptions';

/**
 * Comment subtable
 * Each comment should belong to just one commentable, so we just model that easily.
 * Then each commentable can then be related to an actual entity (route, boulder, etc.)
 */
@Entity()
export default class Comment {

  constructor() {
    this.timestamps = new Timestamps();
    this.timestamps.createdAt = new Date();
    this.timestamps.updatedAt = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(type => Commentable, commentable => commentable.comments, cascadeManyToOne)
  commentable: Commentable;

  @ManyToOne(type => User, user => user.comments, cascadeManyToOne)
  user: User;

  @Column(type => Timestamps)
  timestamps: Timestamps;

}

