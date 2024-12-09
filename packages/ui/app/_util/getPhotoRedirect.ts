import { IPhoto, IPhotoable } from "models";

export default function getPhotoRedirect(
  photoable: IPhotoable,
  photo: IPhoto
): string {
  const tokens = photoable.descriptor.split("-");
  if (tokens.length != 2) return "";
  if (tokens[0] === "crag")
    return `/crags/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "area")
    return `/areas/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "boulder")
    return `/boulders/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "route")
    return `/routes/${tokens[1]}/photos?highlight=${photo.id}`;
  return "";
}
