import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { LatLngLiteral, LatLngTuple } from 'leaflet';

import Coordinate from './Coordinate';
import Area from './Area';
import { cascadeOneToMany } from '../db/cascadeOptions';

@Entity()
export default class Crag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  centerLat: number;

  @Column('decimal')
  centerLng: number;

  get center(): Coordinate {
    return new Coordinate(
      this.centerLat,
      this.centerLng
    );
  }
  set center(obj: Coordinate) {
    this.centerLat = obj.lat;
    this.centerLng = obj.lng;
  }

  @Column('int')
  defaultZoom: number;
  @Column('int')
  minZoom: number;
  @Column('int')
  maxZoom: number;

  // Relationships
  @OneToMany(type => Area, area => area.crag, cascadeOneToMany)
  areas: Area[];

  toJSON() {
    return Object.assign(
      {},
      this,
      {
        center: this.center
      }
    );
  }

  // @todo See fetchCragContainer todo
  _isLoaded?: boolean;

}
