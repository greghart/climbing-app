import { Boulder, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getBoulder = cache(async (id: number | string) => {
  console.log("Getting boulder", id);
  const ds = await getDataSource();
  return ds.getRepository(Boulder).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: [
      "area",
      "area.crag",
      // for boulder form map
      "area.polygon",
      "area.polygon.coordinates",
      "area.boulders",
      // end
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
