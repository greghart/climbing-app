import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { cascadeOneToMany } from '../db/cascadeOptions';
import TrailNode from './TrailNode';

/**
 * Entity that represents the trails within a given crag.
 */
@Entity()
export default class Trail {
  @PrimaryGeneratedColumn()
  id: number;

  // A name for book-keeping. There will likely just be one path per crag but who knows.
  @Column()
  name: string;

  @OneToMany(type => TrailNode, node => node.trail, cascadeOneToMany)
  nodes: TrailNode[];

}
