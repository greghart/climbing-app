import getComments from "@/app/api/_actions/getComments";
import { TrailSchema } from "@/db";
import "server-only";

const getCragComments = getComments(TrailSchema);

export default getCragComments;
