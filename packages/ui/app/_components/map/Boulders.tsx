"use client";

import dynamic from "@/app/_util/dynamic";

const Boulders = dynamic(() => import("./_Boulders"), {
  ssr: false,
});

export default Boulders;
