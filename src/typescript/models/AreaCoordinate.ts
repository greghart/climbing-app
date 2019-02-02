import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import Area from './Area';
import Coordinate from './Coordinate';
import { cascadeManyToOne } from '../db/cascadeOptions';

@Entity()
export default class AreaCoordinate extends Coordinate {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Area, area => area.coordinates, cascadeManyToOne)
  area: Area;
  // boulders?: Boulder[];

  toJSON() {
    return {
      id: this.id,
      ...super.toJSON()
    }
  }
}
