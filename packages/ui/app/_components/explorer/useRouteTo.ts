import { CragContext } from "@/app/_components/explorer/ExplorerContext";
import useRouteTo from "@/app/_util/useRouteTo";
import { useContext } from "react";

/**
 * A version of useRouteTo that only routes to explorer routes
 */
type EntityType = "crag" | "area" | "boulder" | "route";
type EntityId = number;
export default function useRouteToExplorer(
  options: Parameters<typeof useRouteTo>[0] = {}
) {
  if (options.relative === undefined) options.relative = false;

  const routeTo = useRouteTo(options);
  const crag = useContext(CragContext);
  const root = `/crags/${crag?.id}/explorer`;

  return (et: EntityType) => (ei?: EntityId) => {
    if (!crag) return;
    if (et === "crag") {
      return routeTo(root);
    }
    if (et === "area") {
      return routeTo(`${root}/area/${ei}`);
    }
    if (et === "boulder") {
      return routeTo(`${root}/boulder/${ei}`);
    }
    if (et === "route") {
      return routeTo(`${root}/route/${ei}`);
    }
    throw Error("invalid entity type");
  };
}
