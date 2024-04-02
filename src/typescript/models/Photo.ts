import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Upload from "./Upload.js";
import Photoable from "./Photoable.js";
import { cascadeManyToOne } from "../db/cascadeOptions.js";
import User from "./User.js";

/**
 * Photos
 *
 * Photos in the system are an upload and some metadata
 */
@Entity()
export default class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => Photoable,
    (photoable) => photoable.photos,
    cascadeManyToOne
  )
  photoable: Photoable;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne((type) => User, (user) => user.photos, cascadeManyToOne)
  user: User;

  @ManyToOne((type) => Upload, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn()
  upload: Upload;
}
