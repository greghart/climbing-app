import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Route from "./Route.js";
import GradingSystem from "./GradingSystem.js";
import { cascadeManyToOne } from "../db/cascadeOptions.js";

@Entity()
export default class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  // Order difficulties within a grade type
  @Column("int")
  order: number;

  @Column()
  name: string;

  // Certain grading systems can set a plus or minus modifier
  @Column({ default: false })
  isPlus: boolean;

  @Column({ default: false })
  isMinus: boolean;

  // Relationships
  @OneToMany((type) => Route, (route) => route.grade)
  routes: Route;

  @ManyToOne(
    (type) => GradingSystem,
    (system) => system.grades,
    cascadeManyToOne
  )
  gradingSystem: GradingSystem;
}
