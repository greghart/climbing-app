"use client";
import dynamic from "@/app/_util/dynamic";

const Layers = dynamic(() => import("./_Layers"), {
  ssr: false,
});

export default Layers;
