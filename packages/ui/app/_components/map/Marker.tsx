"use client";
import dynamic from "@/app/_util/dynamic";

const Marker = dynamic(() => import("./_Marker"), {
  ssr: false,
});

export default Marker;
