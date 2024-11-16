import getComments from "@/app/api/_actions/getComments";
import { Area } from "@/db";
import "server-only";

const getAreaComments = getComments(Area);

export default getAreaComments;
