import getPhotos from "@/app/api/_actions/getPhotos";
import { BoulderSchema } from "@/db";
import "server-only";

const getBoulderPhotos = getPhotos(BoulderSchema);

export default getBoulderPhotos;
