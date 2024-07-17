"use client";
import dynamic from "next/dynamic";

const AreaMap = dynamic(() => import("./_AreaMap"), {
  ssr: false,
});

export default AreaMap;
