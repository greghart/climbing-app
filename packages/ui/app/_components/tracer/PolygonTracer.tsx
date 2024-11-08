"use client";
import dynamic from "next/dynamic";

const PolygonTracer = dynamic(() => import("./_PolygonTracer"), {
  ssr: false,
});

export default PolygonTracer;
