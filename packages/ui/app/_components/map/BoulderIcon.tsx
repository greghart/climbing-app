"use client";
import dynamic from "@/app/_util/dynamic";

const BoulderIcon = dynamic(() => import("./_BoulderIcon"), {
  ssr: false,
});

export default BoulderIcon;
