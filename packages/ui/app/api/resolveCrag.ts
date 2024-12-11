import { Crag } from "@/db";
import { ICrag, isBounds } from "models";

/**
 * resolvers can be used to resolve our db schema entities to model interface
 */
export default function resolveCrag(crag: Crag | null) {
  if (!crag) return;
  // Bounds is embedded, so fields can be null, but model layer wants it all or nothing
  // if (!crag) return crag;
  if (!isBounds(crag.bounds)) {
    delete crag.bounds;
  }
  return crag as ICrag;
}
