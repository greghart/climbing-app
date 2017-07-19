import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import Boulder from './Boulder';
import Grade from './Grade';
import { cascadeManyToOne } from '../db/cascadeOptions';

@Entity()
export default class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gradeRaw: string;

  // TODO Formalize route type, and decide normalized safe way to constrain
  // boulders to only have bouldering grades
  @ManyToOne(type => Grade, grade => grade.routes)
  grade: Grade;

  // Relationships
  @ManyToOne(type => Boulder, boulder=> boulder.routes, cascadeManyToOne)
  boulder: Boulder;

}
