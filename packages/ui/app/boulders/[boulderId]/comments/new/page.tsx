"use server";
import CommentForm from "@/app/_components/comments/CommentForm";
import createComment from "@/app/api/_actions/createComment";
import getBoulderComments from "@/app/api/_actions/getBoulderComments";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { boulderId: number };
}) {
  const commentable = await getBoulderComments(params.boulderId);
  if (!commentable) notFound();

  return (
    <CommentForm
      commentable={commentable}
      text=""
      action={createComment}
      redirect={`boulders/${params.boulderId}/comments`}
    />
  );
}
