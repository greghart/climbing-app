import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';

import Area from './Area';
import Coordinate from './Coordinate';
import Route from './Route';
import { cascadeManyToOne, cascadeOneToMany } from '../db/cascadeOptions';
import Commentable from './Commentable';
import BoulderCoordinate from './BoulderCoordinate';

@Entity()
class Boulder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Just a single location of a boulder
  @Column(type => Coordinate)
  coordinate: Coordinate;

  // Polygon coordinates of an outline of a boulder
  @OneToMany(type => BoulderCoordinate, coordinate => coordinate.boulder, cascadeOneToMany)
  polygon: BoulderCoordinate[];

  // Relationships
  @ManyToOne(type => Area, area => area.boulders, cascadeManyToOne)
  area: Area;

  @OneToMany(type => Route, route => route.boulder, cascadeOneToMany)
  routes: Route[];

  @OneToOne(type => Commentable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  commentable?: Commentable;

  // Serialization
  toJSON() {
    return Object.assign(
      {},
      this,
      {
        coordinate: this.coordinate
      }
    );
  }

}

export default Boulder;
