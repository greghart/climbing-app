"use client";
import dynamic from "next/dynamic";

const MyPolygon = dynamic(() => import("./_MyPolygon"), {
  ssr: false,
});

export default MyPolygon;
