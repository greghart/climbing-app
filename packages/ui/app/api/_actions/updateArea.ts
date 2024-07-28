"use server";
import areaSchema from "@/app/api/_schemas/area";
import formAction from "@/app/api/formAction";
import { Area, getDataSource } from "@/db";
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
    const area = await ds.getRepository(Area).findOne({
      where: { id: res.meta.id },
    });
    if (!area) return res.err(`area ${res.meta.id} not found`);

    const updatedArea = {
      ...area,
      ...data,
      polygon: {
        ...area.polygon,
        ...data.polygon,
        descriptor: `area-${data.name}-polygon`,
      },
    };
    const saved = await ds.getRepository(Area).save(updatedArea);

    redirect(`/areas/${saved.id}`);
  }
);

export default createArea;
