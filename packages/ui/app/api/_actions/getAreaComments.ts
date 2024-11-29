import getComments from "@/app/api/_actions/getComments";
import { AreaSchema } from "@/db";
import "server-only";

const getAreaComments = getComments(AreaSchema);

export default getAreaComments;
