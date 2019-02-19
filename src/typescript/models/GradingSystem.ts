import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Route from './Route';
import Grade from './Grade';
import { cascadeOneToMany } from '../db/cascadeOptions';

@Entity()
export default class GradingSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Type = Boulder, Sport, Ice, etc. First clas entity?
  @Column()
  type: string;

  // Relationships
  @OneToMany(
    type => Grade,
    grade => grade.gradingSystem,
    cascadeOneToMany,
  )
  grades: Grade[];

}
