"use server";

import RouteForm from "@/app/_components/routes/RouteForm";
import createRoute from "@/app/api/_actions/createRoute";
import getBoulder from "@/app/api/_actions/getBoulder";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ boulderId: number }>;
}) {
  const params = await props.params;
  const boulder = await getBoulder(params.boulderId);
  if (!boulder) notFound();

  return (
    <RouteForm
      boulder={boulder}
      action={createRoute}
      meta={{ boulderId: boulder.id! }}
    />
  );
}
