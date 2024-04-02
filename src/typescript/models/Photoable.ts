import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import Photo from "./Photo.js";
import { cascadeOneToMany } from "../db/cascadeOptions.js";

/**
 * Photoable supertable to model polymorphic photo associations
 */
@Entity()
export default class Photoable {
  @PrimaryGeneratedColumn()
  id: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup for photos
  @Column()
  descriptor: string;

  @OneToMany((type) => Photo, (photo) => photo.photoable, cascadeOneToMany)
  photos: Photo[];
}
