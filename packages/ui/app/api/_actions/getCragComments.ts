import { Commentable, Crag, getDataSource } from "@/db";
import CommentRepository from "@/db/repos/CommentRepository";
import { cache } from "react";
import "server-only";

const getCragComments = cache(async (id: number | string) => {
  console.log("Getting crag", id);
  const ds = await getDataSource();
  // Crag IDs for client can also be name
  const crag = await ds.getRepository(Crag).findOne({
    where: [{ name: id as string }, { id: id as number }],
  });
  if (!crag) return;

  const commentable = await ds.manager
    .withRepository(CommentRepository)
    .findOrGetCommentable(crag, Crag);

  return ds.getRepository(Commentable).findOne({
    where: { id: commentable.id },
    relations: ["comments"], // TODO: add and get user relation
  });
});

export default getCragComments;
