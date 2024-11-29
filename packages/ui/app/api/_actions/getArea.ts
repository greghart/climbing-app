import { AreaSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getArea = cache(async (id: number) => {
  const ds = await getDataSource();
  return ds.getRepository(AreaSchema).findOne({
    where: { id },
    relations: [
      "crag",
      // for polygon tracer / other areas map
      "crag.areas",
      "crag.areas.polygon",
      "crag.areas.polygon.coordinates",
      // end
      "polygon",
      "polygon.coordinates",
      "boulders",
      "boulders.polygon",
      "boulders.polygon.coordinates",
      "boulders.routes",
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
