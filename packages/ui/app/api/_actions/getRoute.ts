import { getDataSource, RouteSchema } from "@/db";
import { CoordinateOptional, IRoute } from "models";
import { cache } from "react";
import "server-only";

const getRoute = cache(async (id: number | string) => {
  const ds = await getDataSource();
  const route = await ds.getRepository(RouteSchema).findOne({
    where: [{ name: id as string }, { id: id as number }],
    relations: [
      "boulder",
      "boulder.routes",
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
  if (route) {
    // TypeORM doesn't have "partial" embeds, so handle nulls here
    route.coordinates = CoordinateOptional.build(route.coordinates)?.toJSON();
  }
  return route as IRoute;
});

export default getRoute;
