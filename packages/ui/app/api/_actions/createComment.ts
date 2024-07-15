"use server";
import ApiResponse from "@/app/api/ApiResponse";
import { Comment, Commentable, getDataSource } from "@/db";
import { CommentSchema } from "@/db/entity/Comment";
import { CommentableSchema } from "@/db/entity/Commentable";
import { IComment } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Data = Pick<IComment, "text">;
const schema = z.object({
  text: z.string().min(5).max(1000),
});

class CreateCommentResponse extends ApiResponse<Data, z.infer<typeof schema>> {}
export type FormState = ReturnType<CreateCommentResponse["toJSON"]>;

async function createComment(id: number, prevState: FormState, data: FormData) {
  const res = new CreateCommentResponse().hydrate(prevState);

  const validatedFields = schema.safeParse({
    text: data.get("text"),
  });
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return res.zerr(validatedFields).toJSON();
  }

  console.log("Getting commentable");
  const ds = await getDataSource();
  const commentable = await ds.getRepository(Commentable).findOne({
    where: { id },
  });
  if (!commentable) return res.err("Commentable not found").toJSON();

  const newComment = {
    commentable,
    ...validatedFields.data,
  };
  const saved = await ds.getRepository(Comment).save(newComment);

  const redirectUrl = getRedirect(commentable, saved);
  if (redirectUrl.length > 0) {
    redirect(redirectUrl); // Navigate to the new post page
  } else {
    return res
      .respond({ text: validatedFields.data.text }, "Comment saved")
      .toJSON();
  }
}

function getRedirect(
  commentable: CommentableSchema,
  comment: CommentSchema
): string {
  console.warn("getRedirect", { commentable, comment });
  const tokens = commentable.descriptor.split("-");
  if (tokens.length != 2) return "";
  if (tokens[0] === "crag")
    return `/crags/${tokens[1]}/comments?highlight=${comment.id}`;
  return "";
}
export default createComment;
