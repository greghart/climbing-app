import Photo, { type IPhoto } from "./Photo.js";

/**
 * Photoable supertable to model polymorphic photo associations
 */
export interface IPhotoable {
  id?: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup for photos
  descriptor: string;
  photos?: IPhoto[];
}

interface Photoable extends Omit<IPhotoable, "photos"> {
  photos: Photo[];
}

class Photoable {
  constructor(data: IPhotoable) {
    this.id = data.id;
    this.descriptor = data.descriptor;
    this.photos = (data.photos || []).map((photo) => new Photo(photo));
  }
}

export default Photoable;
