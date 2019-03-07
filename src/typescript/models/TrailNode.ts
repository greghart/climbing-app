import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import Coordinate from './Coordinate';
import { cascadeManyToOne } from '../db/cascadeOptions';
import Trail from './Trail';
import TrailEdge from './TrailEdge';

/**
 * A node of a trail.
 *
 * Just a coordinate that belongs to a trail basically.
 */
@Entity()
export default class TrailNode extends Coordinate {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Trail, trail => trail.nodes, cascadeManyToOne)
  trail: Trail;

  // All edges are bi-directional.
  // By convention, for nodes A and B, we only store the edge s.t. source is min and dest is max
  @ManyToOne(type => TrailEdge, edge => edge.a, cascadeManyToOne)
  edges: TrailEdge;

}
