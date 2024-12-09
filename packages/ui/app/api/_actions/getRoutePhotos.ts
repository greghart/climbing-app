import getPhotos from "@/app/api/_actions/getPhotos";
import { RouteSchema } from "@/db";
import "server-only";

const getRoutePhotos = getPhotos(RouteSchema);

export default getRoutePhotos;
