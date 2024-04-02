import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";
import { cascadeManyToOne } from "../db/cascadeOptions.js";
import TrailNode from "./TrailNode.js";

/**
 * An edge of a trail, between two TrailNodes
 */
@Entity()
@Index(["a", "b"], { unique: true })
export default class TrailEdge {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => TrailNode, (node) => node.edges, cascadeManyToOne)
  a: TrailNode;

  @ManyToOne((type) => TrailNode, (node) => node.edges, cascadeManyToOne)
  b: TrailNode;

  toJSON() {
    return {
      ...this,
      a: this.a.id,
      b: this.b.id,
    };
  }
}
