import getComments from "@/app/api/_actions/getComments";
import { Boulder } from "@/db";
import "server-only";

const getBoulderComments = getComments(Boulder);

export default getBoulderComments;
