"use client";

import dynamic from "@/app/_util/dynamic";

const Circle = dynamic(() => import("./_Circle"), {
  ssr: false,
});

export default Circle;
