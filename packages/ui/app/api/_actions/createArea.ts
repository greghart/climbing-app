"use server";
import areaSchema from "@/app/api/_schemas/area";
import formAction from "@/app/api/formAction";
import { AreaSchema, CragSchema, getDataSource } from "@/db";
import { IArea } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

// type Model = Pick<IArea, "name" | "description" | "polygon">;
type Meta = { cragId: number };
const createArea = formAction<IArea, z.infer<typeof areaSchema>, Meta>(
  areaSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const crag = await ds.getRepository(CragSchema).findOne({
      where: { id: res.meta.cragId },
    });
    if (!crag) return res.withErr(`crag ${res.meta.cragId} not found`);

    const newArea = {
      crag,
      ...data,
      polygon: {
        ...data.polygon,
        descriptor: `area-${data.name}-polygon`,
      },
    };
    const saved = await ds.getRepository(AreaSchema).save(newArea);

    redirect(`/areas/${saved.id}`);
  }
);

export default createArea;
