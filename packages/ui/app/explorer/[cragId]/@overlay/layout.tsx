import React from "react";
import getArea from "@/app/api/_operations/getCrag";
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

  const crag = await getArea(params.cragId);
  if (!crag) notFound();

  return <ClientLayout crag={crag}>HELLO {children}</ClientLayout>;
}
