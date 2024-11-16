import getComments from "@/app/api/_actions/getComments";
import { Crag } from "@/db";
import "server-only";

const getCragComments = getComments(Crag);

export default getCragComments;
