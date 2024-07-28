"use client";
import { type BoundsFieldType } from "@/app/_components/form/_BoundsField";
import dynamic from "next/dynamic";

const BoundsField = dynamic(() => import("./_BoundsField"), {
  ssr: false,
}) as BoundsFieldType;

export default BoundsField;
