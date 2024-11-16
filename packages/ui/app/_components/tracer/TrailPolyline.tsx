"use client";
import dynamic from "@/app/_util/dynamic";

const TrailPolyline = dynamic(() => import("./_TrailPolyline"), {
  ssr: false,
});

export default TrailPolyline;
