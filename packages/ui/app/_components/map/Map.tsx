"use client";
import dynamic from "@/app/_util/dynamic";

const Map = dynamic(() => import("./_Map"), {
  ssr: false,
});

export default Map;
