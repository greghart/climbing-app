import getPhotos from "@/app/api/_actions/getPhotos";
import { CragSchema } from "@/db";
import "server-only";

const getCragPhotos = getPhotos(CragSchema);

export default getCragPhotos;
