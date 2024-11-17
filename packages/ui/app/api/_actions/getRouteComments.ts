import getComments from "@/app/api/_actions/getComments";
import { Route } from "@/db";
import "server-only";

const getRouteComments = getComments(Route);

export default getRouteComments;
