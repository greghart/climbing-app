import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Coordinate from './Coordinate';
import Crag from './Crag';

/**
 * Rectangle bounds entity for crags
 */
@Entity()
export default class Bounds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(type => Coordinate)
  topLeft: Coordinate;

  @Column(type => Coordinate)
  bottomRight: Coordinate;

  @OneToOne(
    type => Crag,
    crag => crag.bounds,
    {
      nullable: false,
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn()
  crag: Crag;

}
