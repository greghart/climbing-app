"use client";
import dynamic from "@/app/_util/dynamic";

const TrailTracer = dynamic(() => import("./_TrailTracer"), {
  ssr: false,
});

export default TrailTracer;
