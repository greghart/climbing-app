import getPhotos from "@/app/api/_actions/getPhotos";
import { AreaSchema } from "@/db";
import "server-only";

const getAreaPhotos = getPhotos(AreaSchema);

export default getAreaPhotos;
