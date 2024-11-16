"use client";

import dynamic from "@/app/_util/dynamic";

const AreaMap = dynamic(() => import("./_AreaMap"), {
  ssr: false,
});

export default AreaMap;
