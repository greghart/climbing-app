"use server";

import ShowComments from "@/app/_components/comments/ShowComments";
import getBoulderComments from "@/app/api/_actions/getBoulderComments";
import { notFound } from "next/navigation";

export default async function Page(
  props: {
    params: Promise<{ boulderId: number }>;
  }
) {
  const params = await props.params;
  const commentable = await getBoulderComments(params.boulderId);
  if (!commentable) notFound();

  return (
    <ShowComments
      newRoute={`/boulders/${params.boulderId}/comments/new`}
      commentable={commentable}
    />
  );
}
