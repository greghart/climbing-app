import getComments from "@/app/api/_actions/getComments";
import { CragSchema } from "@/db";
import "server-only";

const getCragComments = getComments(CragSchema);

export default getCragComments;
