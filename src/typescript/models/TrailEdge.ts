import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import Coordinate from './Coordinate';
import { cascadeManyToOne } from '../db/cascadeOptions';
import TrailNode from './TrailNode';

/**
 * An edge of a trail, between two TrailNodes
 */
@Entity()
@Index(['a', 'b'], { unique: true })
export default class TrailEdge {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => TrailNode, node => node.edges)
  a: TrailNode;

  @ManyToOne(type => TrailNode, node => node.edges)
  b: TrailNode;

}
