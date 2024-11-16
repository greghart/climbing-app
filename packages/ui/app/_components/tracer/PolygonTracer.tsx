"use client";
import dynamic from "@/app/_util/dynamic";

const PolygonTracer = dynamic(() => import("./_PolygonTracer"), {
  ssr: false,
});

export default PolygonTracer;
