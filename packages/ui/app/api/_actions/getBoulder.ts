import { BoulderSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getBoulder = cache(async (id: number | string) => {
  const ds = await getDataSource();
  return ds.getRepository(BoulderSchema).findOne({
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
