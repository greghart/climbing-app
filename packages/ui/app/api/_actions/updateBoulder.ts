"use server";
import boulderSchema from "@/app/api/_schemas/boulder";
import formAction from "@/app/api/formAction";
import { BoulderSchema, getDataSource } from "@/db";
import { IBoulder } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = Pick<IBoulder, "name" | "description" | "polygon" | "coordinates">;
type Meta = { id: number };
const updateBoulder = formAction<Model, z.infer<typeof boulderSchema>, Meta>(
  boulderSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const boulder = await ds.getRepository(BoulderSchema).findOne({
      where: { id: res.meta.id },
      relations: ["polygon"],
    });
    if (!boulder) return res.err(`boulder ${res.meta.id} not found`);

    const saved = await ds.transaction(async (transactionalEntityManager) => {
      // Set order of polygon points to match array order
      // TODO: Any way to do this automagically?
      if (data.polygon) {
        // Reset polygon line order
        if (boulder.polygon) {
          const qb = transactionalEntityManager.createQueryBuilder();
          await qb
            .update("polygon_coordinate")
            // Hacky way to safely keep valid order values free
            // We want to re-use existing rows but need to avoid unique on (polygon, order)
            .set({ order: () => `${qb.escape("id")} + 10000` })
            .where("polygonId = :id", { id: boulder.polygon.id })
            .execute();
        }
        data.polygon = {
          ...boulder.polygon,
          ...data.polygon,
          descriptor: `boulder-${data.name}-polygon`,
          coordinates: data.polygon.coordinates.map((c, i) => ({
            ...c,
            order: i,
          })),
        } as any;
      }
      Object.assign(boulder, data);

      return transactionalEntityManager
        .getRepository(BoulderSchema)
        .save(boulder);
    });

    redirect(`/boulders/${saved.id}`);
  }
);

export default updateBoulder;
