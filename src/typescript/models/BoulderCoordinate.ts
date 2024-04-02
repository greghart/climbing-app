import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Boulder from "./Boulder.js";
import Coordinate from "./Coordinate.js";
import { cascadeManyToOne } from "../db/cascadeOptions.js";

@Entity()
/**
 * We see here an example of polymorphic modelling where we just setup a table per
 * entity. Coordinates are very simple so this should likely be sufficient.
 */
export default class BoulderCoordinate extends Coordinate {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => Boulder, (boulder) => boulder.polygon, cascadeManyToOne)
  boulder: Boulder;

  toJSON() {
    return {
      id: this.id,
      ...super.toJSON(),
    };
  }
}
