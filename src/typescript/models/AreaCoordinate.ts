import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index
} from 'typeorm';

import Area from './Area';
import Coordinate from './Coordinate';
import { cascadeManyToOne } from '../db/cascadeOptions';

@Entity()
@Index(['area', 'order'], { unique: true })
export default class AreaCoordinate extends Coordinate {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Area, area => area.coordinates, cascadeManyToOne)
  area: Area;
  // boulders?: Boulder[];

  // Order of the coordinates (per area)
  @Column()
  order?: number;

  toJSON() {
    return {
      id: this.id,
      order: this.order,
      ...super.toJSON()
    }
  }
}
