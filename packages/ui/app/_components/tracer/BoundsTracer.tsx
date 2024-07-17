"use client";
import dynamic from "next/dynamic";

const BoundsTracer = dynamic(() => import("./_BoundsTracer"), {
  ssr: false,
});

export default BoundsTracer;
