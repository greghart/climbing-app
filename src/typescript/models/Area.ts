import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';

import AreaCoordinate from './AreaCoordinate';
import Crag from './Crag';
import Boulder from './Boulder';
import Commentable from './Commentable';
import { cascadeManyToOne, cascadeOneToMany } from '../db/cascadeOptions';

@Entity()
export default class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Relationships
  @ManyToOne(type => Crag, crag => crag.areas, cascadeManyToOne)
  crag: Crag;

  @OneToMany(type => AreaCoordinate, coordinate => coordinate.area, cascadeOneToMany)
  coordinates: AreaCoordinate[];

  @OneToMany(type => Boulder, boulder => boulder.area, cascadeOneToMany)
  boulders: Boulder[];

  @OneToOne(type => Commentable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  commentable?: Commentable;

}
