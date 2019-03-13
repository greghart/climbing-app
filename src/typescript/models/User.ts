import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { cascadeOneToMany } from '../db/cascadeOptions';
import Comment from './Comment';
import Photo from './Photo';

/**
 * Users
 *
 * Users of the system.
 */
@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @OneToMany(type => Comment, comment => comment.user, cascadeOneToMany)
  comments?: Comment[];

  @OneToMany(type => Photo, photo => photo.user, cascadeOneToMany)
  photos?: Photo[];

}
