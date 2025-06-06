import getCragTrail from "@/app/api/_actions/getCragTrail";
import resolveCrag from "@/app/api/resolveCrag";
import { CragSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getCrag = cache(async (id: number | string) => {
  const ds = await getDataSource();
  // Crag IDs for client can also be name
  return ds
    .getRepository(CragSchema)
    .findOne({
      where: [{ name: id as string }, { id: id as number }],
      relations: [
        "areas",
        "areas.boulders",
        "areas.boulders.routes",
        "areas.polygon",
        "areas.polygon.coordinates",
        "parking",
      ],
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
    .then(async (_crag) => {
      const crag = resolveCrag(_crag);
      if (!crag) return crag;
      crag.trail = await getCragTrail(crag.id!);
      return crag;
    });
});

export default getCrag;
