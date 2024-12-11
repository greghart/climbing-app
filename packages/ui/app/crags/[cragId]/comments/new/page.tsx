"use server";
import CommentForm from "@/app/_components/comments/CommentForm";
import createComment from "@/app/api/_actions/createComment";
import getCragComments from "@/app/api/_actions/getCragComments";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: number }>;
}) {
  const params = await props.params;
  const commentable = await getCragComments(params.cragId);
  if (!commentable) notFound();

  return (
    <CommentForm commentable={commentable} text="" action={createComment} />
  );
}
