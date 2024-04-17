import { cache } from "react";
import { getDataSource, Crag } from "@/db";
import "server-only";

const getCrag = cache(async (id: number | string) => {
  console.log("Getting crag", id);
  const ds = await getDataSource();
  // Crag IDs for client can also be name
  return ds.getRepository(Crag).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: ["areas", "areas.polygon", "areas.polygon.coordinates"],
    order: {
      // TODO: How do we easily ensure coordinates are ordered correctly?
      areas: {
        polygon: {
          coordinates: {
            order: "ASC",
          },
        },
      },
    },
  });
});

export default getCrag;
