import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Boulder from './Boulder';
import Grade from './Grade';
import { cascadeManyToOne } from '../db/cascadeOptions';
import Commentable from './Commentable';
import Coordinate from './Coordinate';
import Photoable from './Photoable';

@Entity()
export default class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gradeRaw: string;

  @Column({ nullable: true })
  length?: number; // In feet

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  firstAscent?: string;

  // TODO Formalize route type, and decide normalized safe way to constrain
  // boulders to only have bouldering grades
  @ManyToOne(type => Grade, grade => grade.routes)
  grade: Grade;

  // Relationships
  @ManyToOne(type => Boulder, boulder => boulder.routes, cascadeManyToOne)
  boulder: Boulder;

  @OneToOne(type => Commentable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  commentable?: Commentable;

  @OneToOne(type => Photoable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  photoable: Photoable | null;

  // Location of the route -- this will be setup on a polygon of the boulder
  @Column(type => Coordinate)
  coordinate?: Coordinate;

}
