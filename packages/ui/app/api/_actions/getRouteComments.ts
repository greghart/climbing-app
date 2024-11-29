import getComments from "@/app/api/_actions/getComments";
import { RouteSchema } from "@/db";
import "server-only";

const getRouteComments = getComments(RouteSchema);

export default getRouteComments;
