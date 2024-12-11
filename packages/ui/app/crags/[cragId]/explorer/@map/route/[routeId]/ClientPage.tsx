"use client";
import BoulderMap from "@/app/_components/map/BoulderMap";
import RouteMarkers from "@/app/_components/map/RouteMarkers";
import useBoulderView from "@/app/_components/map/useBoulderView";
import blockClicks from "@/app/_util/blockClicks";
import { IRoute, Route } from "models";

export default function ClientPage({ route: _route }: { route: IRoute }) {
  const route = new Route(_route);
  useBoulderView(route.boulder!);

  return (
    <BoulderMap boulder={route.boulder!} onClick={blockClicks}>
      <RouteMarkers routes={[route]} />
    </BoulderMap>
  );
}
