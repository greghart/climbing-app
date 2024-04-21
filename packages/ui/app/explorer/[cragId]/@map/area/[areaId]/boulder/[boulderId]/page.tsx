import React from "react";
import getBoulder from "@/app/api/_operations/getBoulder";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function page({
  params,
}: {
  params: { boulderId: string };
}) {
  const boulder = await getBoulder(params.boulderId);
  if (!boulder) notFound();

  return <ClientPage boulder={boulder} />;
}
