"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Crag as CragModel } from "models";
import { Card } from "@mui/material";

export default function Explorer({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { crag: string };
}) {
  if (!children) return;

  // TODO: Make the card nicer and more interactive/etc.
  // Ideally it's a google maps style bottom slider
  return <Card>{children}</Card>;
}
