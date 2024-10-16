"use client";
import dynamic from "next/dynamic";

const TrailPolyline = dynamic(() => import("./_TrailPolyline"), {
  ssr: false,
});

export default TrailPolyline;
