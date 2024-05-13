"use client";
import blockClicks from "@/app/_components/blockClicks";
import BoulderMap from "@/app/_components/explorer/map/BoulderMap";
import useBoulderView from "@/app/_components/explorer/useBoulderView";
import { IRoute, Route } from "models";

export default function ClientPage({ route: _route }: { route: IRoute }) {
  const route = new Route(_route);
  useBoulderView(route.boulder!);

  return <BoulderMap boulder={route.boulder!} onClick={blockClicks} />;
}
