"use server";
import areaSchema from "@/app/api/_schemas/area";
import formAction from "@/app/api/formAction";
import { AreaSchema, getDataSource } from "@/db";
import { IArea } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = Pick<IArea, "name" | "description" | "polygon">;
type Meta = { id: number };
const createArea = formAction<Model, z.infer<typeof areaSchema>, Meta>(
  areaSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const area = await ds.getRepository(AreaSchema).findOne({
      where: { id: res.meta.id },
      relations: ["polygon"],
    });
    if (!area) return res.err(`area ${res.meta.id} not found`);

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

export default createArea;
