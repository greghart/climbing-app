import { ProtoToCommentable } from "@/app/_grpc/adapters";
import client from "@/app/_grpc/client";
import { CommentableEntityType } from "@/app/_grpc/climb_pb";
import { cache } from "react";
import "server-only";

/**
 * getComments returns comments for given entity.
 * Curried for ease of use.
 */
function getComments(entityType: CommentableEntityType) {
  return cache(async (id: number) => {
    return client
      .getComments({
        entityId: BigInt(id),
        entityType,
      })
      .then((res) => {
        return ProtoToCommentable(res.comments);
      })
      .catch((err) => {
        console.error(`Error fetching comments for ${entityType}: ${err}`);
        throw err;
      });
  });
}

export default getComments;
