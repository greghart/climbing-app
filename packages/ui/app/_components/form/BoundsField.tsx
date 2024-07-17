"use client";
import dynamic from "next/dynamic";

const AreaMap = dynamic(() => import("./_BoundsField"), {
  ssr: false,
});

export default AreaMap;
