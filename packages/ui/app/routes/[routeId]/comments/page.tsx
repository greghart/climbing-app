"use server";

import ShowComments from "@/app/_components/comments/ShowComments";
import getRouteComments from "@/app/api/_actions/getRouteComments";
import { notFound } from "next/navigation";

export default async function Page(
  props: {
    params: Promise<{ routeId: number }>;
  }
) {
  const params = await props.params;
  const commentable = await getRouteComments(params.routeId);
  if (!commentable) notFound();

  return (
    <ShowComments
      newRoute={`/routes/${params.routeId}/comments/new`}
      commentable={commentable}
    />
  );
}
