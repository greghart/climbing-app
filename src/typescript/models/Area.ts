import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import Crag from "./Crag";
import Boulder from "./Boulder";
import Commentable from "./Commentable";
import Polygon from "./Polygon";
import { cascadeManyToOne, cascadeOneToMany } from "../db/cascadeOptions";

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
