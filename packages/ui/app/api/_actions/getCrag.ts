import getCragTrail from "@/app/api/_actions/getCragTrail";
import { Crag, getDataSource } from "@/db";
import { ICrag, isBounds } from "models";
import { cache } from "react";
import "server-only";

const getCrag = cache(async (id: number | string) => {
  const ds = await getDataSource();
  // Crag IDs for client can also be name
  return ds
    .getRepository(Crag)
    .findOne({
      where: [{ name: id as string }, { id: id as number }],
      relations: ["areas", "areas.polygon", "areas.polygon.coordinates"],
      order: {
        areas: {
          polygon: {
            coordinates: {
              order: "ASC",
            },
          },
        },
      },
    })
    .then(async (crag) => {
      if (!crag) return crag;
      // TODO: Where should this logic exist!?
      // Hydrate and dehydrate in model?
      // Bounds is embedded, so fields can be null, but model layer wants it all or nothing
      // if (!crag) return crag;
      if (!isBounds(crag.bounds)) {
        delete crag.bounds;
      }
      crag.trail = await getCragTrail(crag.id!);
      return crag as ICrag;
    });
});

export default getCrag;
