import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Uploads
 *
 * Uploads in the system.
 * @todo The storage engine should be dynamic (S3 vs local for example)
 */
@Entity()
export default class Upload {

  @PrimaryGeneratedColumn()
  id: number;

  // A key to where the upload is stored
  @Column()
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
