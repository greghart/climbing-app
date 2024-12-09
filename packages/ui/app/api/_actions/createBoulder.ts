"use server";
import boulderSchema from "@/app/api/_schemas/boulder";
import formAction from "@/app/api/formAction";
import { AreaSchema, BoulderSchema, getDataSource } from "@/db";
import { IBoulder } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = IBoulder;
type Meta = { areaId: number };
const createBoulder = formAction<Model, z.infer<typeof boulderSchema>, Meta>(
  boulderSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const area = await ds.getRepository(AreaSchema).findOne({
      where: { id: res.meta.areaId },
    });
    if (!area) return res.withErr(`area ${res.meta.areaId} not found`);

    const newBoulder = {
      area,
      ...data,
      polygon: {
        ...data.polygon,
        descriptor: `boulder-${data.name}-polygon`,
      },
    };
    const saved = await ds.getRepository(BoulderSchema).save(newBoulder);

    redirect(`/boulders/${saved.id}`);
  }
);

export default createBoulder;
