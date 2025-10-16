import { CommentableEntityType } from "@/app/_grpc/climb_pb";
import getComments from "@/app/api/_actions/getComments";
import "server-only";

const getBoulderComments = getComments(CommentableEntityType.BOULDER);

export default getBoulderComments;
