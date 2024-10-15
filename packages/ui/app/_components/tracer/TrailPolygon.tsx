"use client";
import dynamic from "next/dynamic";

const TrailPolygon = dynamic(() => import("./_TrailPolygon"), {
  ssr: false,
});

export default TrailPolygon;
