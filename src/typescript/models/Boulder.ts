import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Area from "./Area.js";
import Coordinate from "./Coordinate.js";
import Route from "./Route.js";
import { cascadeManyToOne, cascadeOneToMany } from "../db/cascadeOptions.js";
import Commentable from "./Commentable.js";
import Polygon from "./Polygon.js";
import Photoable from "./Photoable.js";

@Entity()
class Boulder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Just a single location of a boulder
  @Column((type) => Coordinate)
  coordinate: Coordinate;

  // Polygon coordinates of an outline of a boulder, optional
  @OneToOne((type) => Polygon, {
    nullable: true,
    onDelete: "SET NULL",
    cascade: ["insert", "update"],
  })
  @JoinColumn()
  polygon?: Polygon;

  // Relationships
  @ManyToOne((type) => Area, (area) => area.boulders, cascadeManyToOne)
  area: Area;

  @OneToMany((type) => Route, (route) => route.boulder, cascadeOneToMany)
  routes: Route[];

  @OneToOne((type) => Commentable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  commentable?: Commentable | null;

  @OneToOne((type) => Photoable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  photoable: Photoable | null;

  // Serialization
  toJSON() {
    return Object.assign({}, this, {
      coordinate: this.coordinate,
    });
  }
}

export default Boulder;
