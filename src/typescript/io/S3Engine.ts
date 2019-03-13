import * as mime from 'mime';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import IOEngine from './IOEngine';
import Upload from '../models/Upload';
import Source from './Source';

/**
 * Thin I/O Engine around storing things in AWS S3
 */
class S3Engine implements IOEngine {

  static ACL_PRIVATE = 'private';
  static ACL_PUBLIC_READ = 'public-read';
  static ACL_PUBLIC_READ_WRITE = 'public-read-write';
  static ACL_AUTHENTICATED_READ = 'authenticated-read';
  static ACL_BUCKET_OWNER_READ = 'bucket-owner-read';
  static ACL_BUCKET_OWNER_FULL_CONTROL = 'bucket-owner-full-control';

  // Default options for the engine
  static defaultOptions = {
    ACL: S3Engine.ACL_AUTHENTICATED_READ
  };
  s3: AWS.S3;
  bucket: string;

  constructor(bucket: string) {
    this.bucket = bucket;
    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  }

  private resolveKey(upload: Upload) {
    return path.join(
      upload.directory,
      upload.key
    );
  }

  async upload(upload: Upload, source: Source) {
    const buffer = await source.getBuffer();
    const resolvedOptions = {
      ...S3Engine.defaultOptions,
      ContentType: mime.getType(upload.key),
      Bucket: this.bucket,
      Key: this.resolveKey(upload),
      Body: buffer
    };
    await this.s3.putObject(resolvedOptions).promise();
    return buffer;
  }

  download(upload: Upload) {
    return this.s3.getObject({
      ...S3Engine.defaultOptions,
      Bucket: this.bucket,
      Key: this.resolveKey(upload)
    }).promise()
    // S3 returns Buffer in Node.js land (which we are in :check:)
    .then((ret) => ret.Body as Buffer);
  }

  downloadStream(upload: Upload) {
    return this.s3.getObject({
      ...S3Engine.defaultOptions,
      Bucket: this.bucket,
      Key: this.resolveKey(upload)
    }).createReadStream();
  }

  getCode() {
    return 's3';
  }

}

export default S3Engine;
