"use server";
import * as schemas from "@/app/api/_schemas";
import formAction from "@/app/api/formAction";
import { Crag, getDataSource } from "@/db";
import { ICrag } from "models";
import "server-only";
import { z } from "zod";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  bounds: schemas.json.stringNullish.pipe(
    z
      .object({
        topLeft: schemas.coordinate,
        bottomRight: schemas.coordinate,
      })
      .optional()
  ),
});

const updateCrag = formAction<ICrag, z.infer<typeof schema>>(
  schema,
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
