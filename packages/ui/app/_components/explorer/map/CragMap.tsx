"use client";
import dynamic from "next/dynamic";

const CragMap = dynamic(() => import("./_CragMap"), {
  ssr: false,
});

export default CragMap;
