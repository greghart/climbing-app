import { ProtoToCrag } from "@/app/_grpc/adapters";
import client from "@/app/_grpc/client";
import { ReadCragOptions } from "@/app/_grpc/climb_pb";
import { ExtractMessage } from "@/app/_util/grpc";
import getCragTrail from "@/app/api/_actions/getCragTrail";
import resolveCrag from "@/app/api/resolveCrag";
import { CragSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getCrag = cache(
  async (
    id: number | string,
    opts: ExtractMessage<ReadCragOptions> = {
      includes: [
        "areas.boulders.routes",
        "areas.polygon.coordinates",
        "parking",
        "trail.lines",
      ],
    }
  ) => {
    return client
      .getCrag({
        id: BigInt(id),
        opts,
      })
      .then((res) => {
        if (res.crag) {
          const proto = ProtoToCrag(res.crag);
          console.warn("getCrag", proto);
          return proto;
        }
        return null;
      })
      .catch((err) => {
        console.error("Error fetching crag:", err);
        throw err;
      });
  }
);

const getCragLegacy = cache(async (id: number | string) => {
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
