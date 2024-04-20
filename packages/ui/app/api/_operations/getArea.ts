import { cache } from "react";
import { getDataSource, Area } from "@/db";
import "server-only";

const getArea = cache(async (id: number | string) => {
  console.log("Getting area", id);
  const ds = await getDataSource();
  return ds.getRepository(Area).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: [
      "crag",
      "polygon",
      "polygon.coordinates",
      "boulders",
      "boulders.polygon",
      "boulders.polygon.coordinates",
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

export default getArea;
