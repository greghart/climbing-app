import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index
} from 'typeorm';
import Polygon from './Polygon';
import Coordinate from './Coordinate';
import { cascadeManyToOne } from '../db/cascadeOptions';

/**
 * A coordinate of a polygon
 *
 * Very similar to a regular coordinate, but has an order which matters to
 * a polygon
 */
@Entity()
@Index(['polygon', 'order'], { unique: true })
export default class PolygonCoordinate extends Coordinate {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Polygon, polygon => polygon.coordinates, cascadeManyToOne)
  polygon: Polygon;

  // Order of the coordinates (per polygon)
  @Column()
  order: number;

  toJSON() {
    return {
      id: this.id,
      order: this.order,
      ...super.toJSON()
    }
  }
}
