"use server";
import cragSchema from "@/app/api/_schemas/crag";
import formAction from "@/app/api/formAction";
import { CragSchema, getDataSource } from "@/db";
import CragRepository from "@/db/repos/CragRepository";
import { ICrag, isBounds } from "models";
import "server-only";
import { z } from "zod";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const updateCrag = formAction<ICrag, z.infer<typeof cragSchema>>(
  cragSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const saved = await ds.transaction(async (transactionalEntityManager) => {
      const crag = await transactionalEntityManager
        .getRepository(CragSchema)
        .findOne({
          where: { id: res.data.id },
          relations: ["trail"],
        });
      if (!crag) {
        return undefined;
      }
      await delay(500);
      // Set order of trail points to match array order
      // TODO: Any way to do this automagically?
      if (data.trail) {
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
        data.trail = {
          ...data.trail,
          lines: data.trail.lines.map((line, i) => ({
            ...line,
            order: i,
          })),
        } as any;
      }
      Object.assign(crag, data);
      return transactionalEntityManager
        .withRepository(CragRepository)
        .saveT(crag);
    });
    if (!saved) {
      return res.withErr("crag not found");
    }
    if (!isBounds(saved.bounds)) {
      delete saved.bounds;
    }
    return res.respond(saved, "Crag updated");
  }
);

export default updateCrag;
