import Photo, { type IPhoto } from "./Photo.js";

interface IOUpload {
  id: number;
  // A key to where the upload is stored
  key: string;
  // A directory namespace where the upload is stored
  directory: string;
  // Which engine this upload is stored under
  engine: string;
  // Original name of file
  originalName: string;
  // Size of file in bytes
  fileSize: number;
  // SHA-1 Hash of file for verification
  sha1Hash: string;
  // Timestamp of upload
  uploadedAt: Date;
}

export type IUpload = IOUpload & {
  photo?: IPhoto;
};

interface Upload extends IUpload {}
class Upload {
  constructor(data: IUpload) {
    this.id = data.id;
    this.key = data.key;
    this.directory = data.directory;
    this.engine = data.engine;
    this.originalName = data.originalName;
    this.fileSize = data.fileSize;
    this.sha1Hash = data.sha1Hash;
    this.uploadedAt = data.uploadedAt;
    if (data.photo) {
      this.photo = new Photo(data.photo);
    }
  }
}

export default Upload;
