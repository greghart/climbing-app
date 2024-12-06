import { type Upload as IOUpload } from "power-putty-io";
import Photo, { type IPhoto } from "./Photo.js";

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
