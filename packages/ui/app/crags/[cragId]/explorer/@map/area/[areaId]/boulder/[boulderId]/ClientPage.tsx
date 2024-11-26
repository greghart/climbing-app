"use client";
import BoulderMap from "@/app/_components/map/BoulderMap";
import useBoulderView from "@/app/_components/map/useBoulderView";
import blockClicks from "@/app/_util/blockClicks";
import { IBoulder } from "models";

export default function ClientPage({ boulder }: { boulder: IBoulder }) {
  useBoulderView(boulder);
  return <BoulderMap boulder={boulder} onClick={blockClicks} showRoutes />;
}
