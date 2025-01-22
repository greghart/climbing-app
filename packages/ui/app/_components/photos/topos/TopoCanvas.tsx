"use client";
import dynamic from "@/app/_util/dynamic";

const TopoCanvas = dynamic(() => import("./_TopoCanvas"), {
  ssr: false,
});

export default TopoCanvas;
