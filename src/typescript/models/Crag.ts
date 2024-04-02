import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Coordinate, { CoordinateOptional } from "./Coordinate.js";
import Area from "./Area.js";
import { cascadeOneToMany } from "../db/cascadeOptions.js";
import Commentable from "./Commentable.js";
import Trail from "./Trail.js";
import Bounds from "./Bounds.js";

@Entity()
export default class Crag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne((type) => Bounds, (bounds) => bounds.crag, {
    nullable: true,
    onDelete: "SET NULL",
  })
  bounds?: Bounds;

  @Column((type) => CoordinateOptional)
  _center?: CoordinateOptional;

  get center(): Coordinate | undefined {
    if (this._center.lat && this._center.lng) {
      return new Coordinate(this._center.lat, this._center.lng);
    }
  }

  @Column("int")
  defaultZoom: number;
  @Column("int")
  minZoom: number;
  @Column("int")
  maxZoom: number;

  // Relationships
  @OneToMany((type) => Area, (area) => area.crag, cascadeOneToMany)
  areas: Area[];

  @OneToOne((type) => Commentable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  commentable?: Commentable;

  @OneToOne((type) => Trail, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  trail?: Trail;

  // @todo See fetchCragContainer todo
  _isLoaded?: boolean;

  toJSON(): any {
    return Object.keys(this).reduce(
      (memo, k) => ({
        ...memo,
        [k]: this[k],
      }),
      {
        center: this.center,
      }
    );
  }
}
