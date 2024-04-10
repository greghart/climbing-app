import React from "react";
import { notFound } from "next/navigation";
import getCrag from "@/app/api/_operations/getCrag";
import ClientLayout from "./ClientLayout";

export interface Props {
  children: React.ReactNode;
  overlay: React.ReactNode;
  map: React.ReactNode;
  params: {
    cragId: string;
  };
}

/**
 * Layout for explorer is setup with parallel routes.
 * * Has an un-used drawer
 * * Map routes
 * * Overlay detail routes
 */
export default async function RootLayout(props: Props) {
  const crag = await getCrag(props.params.cragId);
  if (!crag) notFound();

  return <ClientLayout crag={crag} {...props} />;
}
