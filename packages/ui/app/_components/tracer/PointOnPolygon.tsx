"use client";
import dynamic from "@/app/_util/dynamic";

const PolygonTracer = dynamic(() => import("./_PointOnPolygon"), {
  ssr: false,
});

export default PolygonTracer;
