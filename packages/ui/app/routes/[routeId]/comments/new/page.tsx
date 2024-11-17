"use server";
import CommentForm from "@/app/_components/comments/CommentForm";
import createComment from "@/app/api/_actions/createComment";
import getRouteComments from "@/app/api/_actions/getRouteComments";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { routeId: number };
}) {
  const commentable = await getRouteComments(params.routeId);
  if (!commentable) notFound();

  return (
    <CommentForm
      commentable={commentable}
      text=""
      action={createComment}
      redirect={`routes/${params.routeId}/comments`}
    />
  );
}
