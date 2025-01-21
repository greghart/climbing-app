import Photoable, { type IPhotoable } from "./Photoable.js";
import Timestamps, { type ITimestamps } from "./Timestamps.js";
import type { ITopo } from "./Topo.js";
import Topo from "./Topo.js";
import Upload, { type IUpload } from "./Upload.js";

export type IPhoto = {
  id: number;
  title: string;
  description?: string;
  upload?: IUpload;
  photoable?: IPhotoable;
  topo?: ITopo;
  // user: IUser; // TODO
} & ITimestamps;

interface Photo extends Omit<IPhoto, "photoable" | "topo"> {
  photoable?: Photoable;
  topo?: Topo;
}

class Photo {
  constructor(data: IPhoto) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    Timestamps.mix(this, data);
    if (data.upload) {
      this.upload = new Upload(data.upload);
    }
    if (data.photoable) {
      this.photoable = new Photoable(data.photoable);
    }
    if (data.topo) {
      this.topo = new Topo(data.topo);
    }
  }
}

export default Photo;
