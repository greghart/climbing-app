import React from "react";
import getCrag from "@/app/api/_operations/getCrag";
import { notFound } from "next/navigation";
import ClientLayout from "@/app/explorer/[cragId]/@overlay/ClientLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { cragId: string };
}) {
  if (!children) return;

  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return <ClientLayout crag={crag}>HELLO {children}</ClientLayout>;
}
