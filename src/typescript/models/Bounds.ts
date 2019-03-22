import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Coordinate from './Coordinate';

/**
 * Rectangle bounds entity
 */
@Entity()
export default class Bounds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(type => Coordinate)
  topLeft: Coordinate;

  @Column(type => Coordinate)
  bottomRight: Coordinate;

}
