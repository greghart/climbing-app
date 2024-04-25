import { cache } from "react";
import { getDataSource, Route } from "@/db";
import "server-only";

const getRoute = cache(async (id: number | string) => {
  console.log("Getting route", id);
  const ds = await getDataSource();
  return ds.getRepository(Route).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: [
      "boulder",
      "boulder.polygon",
      "boulder.polygon.coordinates",
      "boulder.area",
      "boulder.area.crag",
    ],
    order: {
      boulder: {
        polygon: {
          coordinates: {
            order: "ASC",
          },
        },
      },
    },
  });
});

export default getRoute;
