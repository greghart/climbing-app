"use server";
import CommentForm from "@/app/_components/comments/CommentForm";
import createComment from "@/app/api/_actions/createComment";
import getAreaComments from "@/app/api/_actions/getAreaComments";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ areaId: number }>;
}) {
  const params = await props.params;
  const commentable = await getAreaComments(params.areaId);
  if (!commentable) notFound();

  return (
    <CommentForm commentable={commentable} text="" action={createComment} />
  );
}
