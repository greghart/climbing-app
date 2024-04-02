import myDataSource from "../../db/myDataSource.js";
import Photo from "../../models/Photo.js";
import User from "../../models/User.js";
import Photoable from "../../models/Photoable.js";
import Upload from "../../models/Upload.js";

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
  return myDataSource.getRepository(Photo).save(photo);
};

export default addPhotoToPhotoable;
