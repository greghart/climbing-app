"use client";
import dynamic from "@/app/_util/dynamic";

const CoordinateTracer = dynamic(() => import("./_CoordinateTracer"), {
  ssr: false,
});

export default CoordinateTracer;
