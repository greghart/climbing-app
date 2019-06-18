import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Coordinate from './Coordinate';
import Area from './Area';
import { cascadeOneToMany } from '../db/cascadeOptions';
import Commentable from './Commentable';
import Trail from './Trail';
import Bounds from './Bounds';

@Entity()
export default class Crag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(
    type => Bounds,
    bounds => bounds.crag,
    {
      nullable: true,
      onDelete: 'SET NULL'
    }
  )
  bounds?: Bounds;

  @Column('int')
  defaultZoom: number;
  @Column('int')
  minZoom: number;
  @Column('int')
  maxZoom: number;

  // Relationships
  @OneToMany(type => Area, area => area.crag, cascadeOneToMany)
  areas: Area[];

  @OneToOne(type => Commentable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  commentable?: Commentable;

  @OneToOne(type => Trail, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  trail?: Trail;

  // @todo See fetchCragContainer todo
  _isLoaded?: boolean;

}
