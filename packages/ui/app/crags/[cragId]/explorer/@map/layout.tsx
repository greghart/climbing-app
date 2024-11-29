import getArea from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";
import React from "react";
import ClientLayout from "./ClientLayout";

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ cragId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  if (!children) return;

  const crag = await getArea(params.cragId);
  if (!crag) notFound();

  return <ClientLayout crag={crag}>{children}</ClientLayout>;
}
