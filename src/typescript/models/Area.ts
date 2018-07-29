import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import AreaCoordinate from './AreaCoordinate';
import Crag from './Crag';
import Boulder from './Boulder';
import { cascadeManyToOne, cascadeOneToMany } from '../db/cascadeOptions';

@Entity()
export default class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relationships
  @ManyToOne(type => Crag, crag => crag.areas, cascadeManyToOne)
  crag: Crag;

  @OneToMany(type => AreaCoordinate, coordinate => coordinate.area, cascadeOneToMany)
  coordinates: AreaCoordinate[] = [];

  @OneToMany(type => Boulder, boulder => boulder.area, cascadeOneToMany)
  boulders: Boulder[] = [];

}
