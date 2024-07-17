"use client";
import dynamic from "next/dynamic";

const BoundsPolygon = dynamic(() => import("./_BoundsPolygon"), {
  ssr: false,
});

export default BoundsPolygon;
