"use server";

import ShowComments from "@/app/_components/comments/ShowComments";
import getAreaComments from "@/app/api/_actions/getAreaComments";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { areaId: number } }) {
  const commentable = await getAreaComments(params.areaId);
  if (!commentable) notFound();

  return (
    <ShowComments
      newRoute={`/areas/${params.areaId}/comments/new`}
      commentable={commentable}
    />
  );
}
