"use server";
import client from "@/app/_grpc/client";
import getCrag from "@/app/api/_actions/getCrag";
import cragSchema from "@/app/api/_schemas/crag";
import formAction from "@/app/api/formAction";
import { CragSchema, getDataSource } from "@/db";
import CragRepository from "@/db/repos/CragRepository";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { ICrag, isBounds } from "models";
import "server-only";
import { z } from "zod";

const updateCrag = formAction<
  ICrag,
  z.infer<typeof cragSchema>,
  { id: number; fieldMask: string[] }
>(cragSchema, async (res, data) => {
  await client.updateCrag({
    id: BigInt(res.meta.id),
    requestedAt: timestampFromDate(res.data.updatedAt),
    fieldMask: {
      paths: res.meta.fieldMask,
    },
    name: data.name,
    description: data.description,
    bounds: data.bounds,
    // TODO: Technically our models should be bigints, but large change in this codebase, so put it
    // off for now.
    trail: data.trail as any,
  });
  const crag = await getCrag(res.meta.id);
  return res.respond(crag!, "Crag updated");
});

const updateCragLegacy = formAction<ICrag, z.infer<typeof cragSchema>>(
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
