"use server";
import cragSchema from "@/app/api/_schemas/crag";
import formAction from "@/app/api/formAction";
import { Crag, getDataSource } from "@/db";
import { ICrag } from "models";
import "server-only";
import { z } from "zod";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const updateCrag = formAction<ICrag, z.infer<typeof cragSchema>>(
  cragSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const saved = await ds.transaction(async (transactionalEntityManager) => {
      const crag = await transactionalEntityManager
        .getRepository(Crag)
        .findOne({
          where: { id: res.data.id },
          relations: ["trail"],
        });
      if (!crag) {
        return undefined;
      }
      await delay(500);
      // Reset trail line order
      if (crag.trail) {
        const qb = transactionalEntityManager.createQueryBuilder();
        await qb
          .update("trail_line")
          // Hacky way to safely keep valid order values free
          // We want to re-use existing rows but need to avoid unique on (trail, order)
          .set({ order: () => `${qb.escape("id")} + 10000` })
          .where("trailId = :id", { id: crag.trail.id })
          .execute();
      }
      if (data.trail) {
        data.trail = {
          ...data.trail,
          lines: data.trail.lines.map((line, i) => ({
            ...line,
            order: i,
          })),
        } as any;
      }
      Object.assign(crag, data);
      return transactionalEntityManager.getRepository(Crag).save(crag);
    });
    if (!saved) {
      return res.err("crag not found");
    }
    return res.respond(saved, "Crag updated");
  }
);

export default updateCrag;
