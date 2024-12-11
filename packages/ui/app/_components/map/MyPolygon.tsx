"use client";
import dynamic from "@/app/_util/dynamic";

const MyPolygon = dynamic(() => import("./_MyPolygon"), {
  ssr: false,
});

export default MyPolygon;
