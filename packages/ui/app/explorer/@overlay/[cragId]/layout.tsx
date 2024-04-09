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
  // TODO In reality there is no overlay while in crag explorer, not till you click some things
  return <Card>Hello!</Card>;
}
