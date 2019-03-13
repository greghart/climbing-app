import { getRepository } from 'typeorm';

import Photo from '../../models/Photo';
import User from '../../models/User';
import Photoable from '../../models/Photoable';
import Upload from '../../models/Upload';

const addPhotoToPhotoable = (
  photoable: Photoable,
  title: string,
  description: string,
  upload: Upload,
  user: User
) => {
  const photo = new Photo();
  photo.title = title;
  photo.description = description;
  photo.upload = upload;
  photo.photoable = photoable;
  return getRepository(Photo).save(photo);
};

export default addPhotoToPhotoable;
