"use client";
import dynamic from "next/dynamic";

const TrailTracer = dynamic(() => import("./_TrailTracer"), {
  ssr: false,
});

export default TrailTracer;
