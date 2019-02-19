import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { cascadeOneToMany } from '../db/cascadeOptions';
import PolygonCoordinate from './PolygonCoordinate';

/**
 * Polygon supertable to model polymorphic polygon associations
 */
@Entity()
export default class Polygon {
  @PrimaryGeneratedColumn()
  id: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup with polygons
  @Column()
  descriptor: string;

  @OneToMany(type => PolygonCoordinate, c => c.polygon, cascadeOneToMany)
  coordinates: PolygonCoordinate[];

}
