import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Upload as IOUpload } from 'power-putty-io';

/**
 * Uploads
 *
 * Uploads in the system.
 * Conventiently this has the same interface as power-putty-io `Upload`
 */
@Entity()
export default class Upload implements IOUpload {

  @PrimaryGeneratedColumn()
  id: number;

  // A key to where the upload is stored
  @Column({ unique: true })
  key: string;

  // A directory namespace where the upload is stored
  @Column()
  directory: string;

  // Which engine this upload is stored under
  @Column()
  engine: string;

  // Original name of file
  @Column()
  originalName: string;

  // Size of file in bytes
  @Column()
  fileSize: number;

  // SHA-1 Hash of file for verification
  @Column()
  sha1Hash: string;

  @Column()
  uploadedAt: Date;

}
