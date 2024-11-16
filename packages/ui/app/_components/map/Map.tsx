"use client";
import dynamic from "@/app/_util/dynamic";

const Map = dynamic(() => import("./_Map"), {
  ssr: false,
  loading: () => <p>Javascript support needed for map components</p>,
});

export default Map;
