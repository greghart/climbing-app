import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";
import React from "react";
import ClientLayout from "./ClientLayout";

export interface Props {
  children: React.ReactNode;
  overlay: React.ReactNode;
  map: React.ReactNode;
  params: Promise<{
    cragId: string;
  }>;
}

/**
 * Layout for explorer is setup with parallel routes.
 * * Has an un-used drawer
 * * Map routes
 * * Overlay detail routes
 */
export default async function RootLayout({ params, ...props }: Props) {
  const crag = await getCrag((await params).cragId);
  if (!crag) notFound();

  return <ClientLayout crag={crag} {...props} />;
}
