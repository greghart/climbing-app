import React from "react";
import { Card } from "@mui/material";

export default function Explorer({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { cragId: string };
}) {
  if (!children) return;

  // TODO: Make the card nicer and more interactive/etc.
  // Ideally it's a google maps style bottom slider
  return <Card>OK {children}</Card>;
}
