"use server";
import client from "@/app/_grpc/client";
import getArea from "@/app/api/_actions/getArea";
import areaSchema from "@/app/api/_schemas/area";
import formAction from "@/app/api/formAction";
import { AreaSchema, getDataSource } from "@/db";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { IArea } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Meta = { id: number; fieldMask: string[] };
const updateArea = formAction<IArea, z.infer<typeof areaSchema>, Meta>(
  areaSchema,
  async (res, data) => {
    await client.updateArea({
      id: BigInt(res.meta.id),
      requestedAt: timestampFromDate(res.data.updatedAt),
      fieldMask: {
        paths: res.meta.fieldMask,
      },
      name: data.name,
      description: data.description,
      polygon: data.polygon as any, // TODO: Fix id types
    });
    const area = await getArea(res.meta.id);
    return res.respond(area!, "Area updated");
  }
);

const createAreaLegacy = formAction<IArea, z.infer<typeof areaSchema>, Meta>(
  areaSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const area = await ds.getRepository(AreaSchema).findOne({
      where: { id: res.meta.id },
      relations: ["polygon"],
    });
    if (!area) return res.withErr(`area ${res.meta.id} not found`);

    const saved = await ds.transaction(async (transactionalEntityManager) => {
      // Set order of polygon points to match array order
      // TODO: Any way to do this automagically?
      if (data.polygon) {
        // Reset polygon line order
        if (area.polygon) {
          const qb = transactionalEntityManager.createQueryBuilder();
          await qb
            .update("polygon_coordinate")
            // Hacky way to safely keep valid order values free
            // We want to re-use existing rows but need to avoid unique on (polygon, order)
            .set({ order: () => `${qb.escape("id")} + 10000` })
            .where("polygonId = :id", { id: area.polygon.id })
            .execute();
        }
        data.polygon = {
          ...area.polygon,
          ...data.polygon,
          descriptor: `area-${data.name}-polygon`,
          coordinates: data.polygon.coordinates.map((c, i) => ({
            ...c,
            order: i,
          })),
        } as any;
      }
      Object.assign(area, data);

      return transactionalEntityManager.getRepository(AreaSchema).save(area);
    });

    redirect(`/areas/${saved.id}`);
  }
);

export default updateArea;
