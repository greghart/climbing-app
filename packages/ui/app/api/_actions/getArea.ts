import { ProtoToArea } from "@/app/_grpc/adapters";
import client from "@/app/_grpc/client";
import { ReadAreaOptions } from "@/app/_grpc/climb_pb";
import { ExtractMessage } from "@/app/_util/grpc";
import getCrag from "@/app/api/_actions/getCrag";
import { AreaSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

const getArea = cache(
  async (
    id: bigint | number,
    opts: ExtractMessage<ReadAreaOptions> = {
      includes: [
        "polygon.coordinates",
        "boulders.polygon.coordinates",
        "boulders.routes",
      ],
    }
  ) => {
    try {
      const res = await client.getArea({
        id: BigInt(id),
        opts,
      });
      if (!res.area) {
        return null;
      }
      const area = ProtoToArea(res.area);
      area.crag = (await getCrag(res.area.cragId, { includes: [] }))!;
      return area;
    } catch (err) {
      console.error("Error fetching crag:", err);
      throw err;
    }
  }
);

const getAreaLegacy = cache(async (id: number) => {
  const ds = await getDataSource();
  return ds.getRepository(AreaSchema).findOne({
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
