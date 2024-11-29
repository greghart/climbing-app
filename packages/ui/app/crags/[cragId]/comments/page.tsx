"use server";

import ShowComments from "@/app/_components/comments/ShowComments";
import getCragComments from "@/app/api/_actions/getCragComments";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ cragId: string }> }) {
  const params = await props.params;
  const commentable = await getCragComments(params.cragId);
  if (!commentable) notFound();

  return (
    <ShowComments
      newRoute={`/crags/${params.cragId}/comments/new`}
      commentable={commentable}
    />
  );
}
