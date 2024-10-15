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
        .findOneBy({ id: res.data.id });
      if (!crag) {
        return undefined;
      }
      await delay(500);
      // TODO: is this best place for this? Are there implicit repos or anything?
      if (data.trail) {
        data.trail = {
          ...data.trail,
          lines: data.trail.lines.map((line, i) => ({
            ...line,
            order: i,
          })),
        };
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
