"use server";

import ShowComments from "@/app/_components/comments/ShowComments";
import getAreaComments from "@/app/api/_actions/getAreaComments";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ areaId: number }> }) {
  const params = await props.params;
  const commentable = await getAreaComments(params.areaId);
  if (!commentable) notFound();

  return (
    <ShowComments
      newRoute={`/areas/${params.areaId}/comments/new`}
      commentable={commentable}
    />
  );
}
