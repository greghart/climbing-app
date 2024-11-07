import { Area, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getArea = cache(async (id: number) => {
  const ds = await getDataSource();
  return ds.getRepository(Area).findOne({
    where: { id },
    relations: [
      "crag",
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
