import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Boulder from "./Boulder.js";
import Grade from "./Grade.js";
import { cascadeManyToOne } from "../db/cascadeOptions.js";
import Commentable from "./Commentable.js";
import Coordinate, { CoordinateOptional } from "./Coordinate.js";
import Photoable from "./Photoable.js";

@Entity()
export default class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gradeRaw: string;

  @Column({ nullable: true })
  length?: number; // In feet

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  firstAscent?: string;

  // TODO Formalize route type, and decide normalized safe way to constrain
  // boulders to only have bouldering grades
  @ManyToOne((type) => Grade, (grade) => grade.routes)
  grade: Grade;

  // Relationships
  @ManyToOne((type) => Boulder, (boulder) => boulder.routes, cascadeManyToOne)
  boulder: Boulder;

  @OneToOne((type) => Commentable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  commentable?: Commentable;

  @OneToOne((type) => Photoable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  photoable: Photoable | null;

  // Location of the route -- this will be setup on a polygon of the boulder
  // Optional embedded columns
  @Column((type) => CoordinateOptional)
  _coordinate: CoordinateOptional;

  get coordinate(): Coordinate | undefined {
    if (this._coordinate.lat && this._coordinate.lng) {
      return new Coordinate(this._coordinate.lat, this._coordinate.lng);
    }
  }
}
