"use server";
import formAction from "@/app/api/formAction";
import {
  Comment,
  Commentable,
  CommentableSchema,
  CommentSchema,
  getDataSource,
} from "@/db";
import { IComment } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = Pick<IComment, "text">;
type Meta = { commentable_id: number };
const schema = z.object({
  text: z.string().min(5).max(1000),
});

const createComment = formAction<Model, z.infer<typeof schema>, Meta>(
  schema,
  async (res, data, prevState) => {
    const ds = await getDataSource();
    const commentable = await ds.getRepository(CommentableSchema).findOne({
      where: { id: prevState.meta.commentable_id },
    });
    if (!commentable) return res.err("Commentable not found");

    const newComment = {
      commentable,
      ...data,
    };
    const saved = await ds.getRepository(CommentSchema).save(newComment);

    const redirectUrl = getRedirect(commentable, saved);
    if (redirectUrl.length > 0) {
      redirect(redirectUrl); // Navigate to the new post page
    } else {
      return res.respond({ text: data.text }, "Comment saved");
    }
  }
);

function getRedirect(commentable: Commentable, comment: Comment): string {
  const tokens = commentable.descriptor.split("-");
  if (tokens.length != 2) return "";
  if (tokens[0] === "crag")
    return `/crags/${tokens[1]}/comments?highlight=${comment.id}`;
  if (tokens[0] === "area")
    return `/areas/${tokens[1]}/comments?highlight=${comment.id}`;
  if (tokens[0] === "boulder")
    return `/boulders/${tokens[1]}/comments?highlight=${comment.id}`;
  if (tokens[0] === "route")
    return `/routes/${tokens[1]}/comments?highlight=${comment.id}`;
  return "";
}

export default createComment;
