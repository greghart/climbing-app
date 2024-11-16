"use client";
import dynamic from "@/app/_util/dynamic";

const BoundsPolygon = dynamic(() => import("./_BoundsPolygon"), {
  ssr: false,
});

export default BoundsPolygon;
