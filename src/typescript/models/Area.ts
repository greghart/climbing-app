import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Crag from "./Crag.js";
import Boulder from "./Boulder.js";
import Commentable from "./Commentable.js";
import Polygon from "./Polygon.js";
import { cascadeManyToOne, cascadeOneToMany } from "../db/cascadeOptions.js";

@Entity()
export default class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // Relationships
  @ManyToOne((type) => Crag, (crag) => crag.areas, cascadeManyToOne)
  crag: Crag;

  @OneToMany((type) => Boulder, (boulder) => boulder.area, cascadeOneToMany)
  boulders: Boulder[];

  @OneToOne((type) => Commentable, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  commentable?: Commentable | null;

  // Areas must be defined with a polygon
  @OneToOne((type) => Polygon, {
    nullable: false,
    onDelete: "SET NULL",
    cascade: ["insert", "update"],
  })
  @JoinColumn()
  polygon: Polygon;
}
