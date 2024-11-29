import getComments from "@/app/api/_actions/getComments";
import { BoulderSchema } from "@/db";
import "server-only";

const getBoulderComments = getComments(BoulderSchema);

export default getBoulderComments;
