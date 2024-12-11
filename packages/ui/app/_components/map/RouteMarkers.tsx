"use client";
import dynamic from "@/app/_util/dynamic";

const RouteMarkers = dynamic(() => import("./_RouteMarkers"), {
  ssr: false,
});

export default RouteMarkers;
