"use client";
import dynamic from "@/app/_util/dynamic";

const BoundsTracer = dynamic(() => import("./_BoundsTracer"), {
  ssr: false,
});

export default BoundsTracer;
