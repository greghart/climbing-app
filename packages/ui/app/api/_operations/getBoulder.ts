import { cache } from "react";
import { getDataSource, Boulder } from "@/db";
import "server-only";

const getBoulder = cache(async (id: number | string) => {
  console.log("Getting boulder", id);
  const ds = await getDataSource();
  return ds.getRepository(Boulder).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: [
      "area",
      "area.crag",
      "routes",
      "polygon",
      "polygon.coordinates",
    ],
    order: {
      polygon: {
        coordinates: {
          order: "ASC",
        },
      },
    },
  });
});

export default getBoulder;
