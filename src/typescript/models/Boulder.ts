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

@Entity()
class Boulder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lng: number;

  get coordinate(): Coordinate {
    return new Coordinate(
      this.lat,
      this.lng
    );
  }
  set coordinate(obj: Coordinate) {
    this.lat = obj.lat;
    this.lng = obj.lng;
  }

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
