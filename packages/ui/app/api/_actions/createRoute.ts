"use server";
import routeSchema from "@/app/api/_schemas/route";
import formAction from "@/app/api/formAction";
import { BoulderSchema, RouteSchema, getDataSource } from "@/db";
import { IRoute } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = IRoute;
type Meta = { boulderId: number };
const createRoute = formAction<Model, z.infer<typeof routeSchema>, Meta>(
  routeSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const boulder = await ds.getRepository(BoulderSchema).findOne({
      where: { id: res.meta.boulderId },
    });
    if (!boulder) return res.withErr(`boulder ${res.meta.boulderId} not found`);

    const newRoute = {
      boulder,
      ...data,
    };
    const saved = await ds.getRepository(RouteSchema).save(newRoute);

    redirect(`/routes/${saved.id}`);
  }
);

export default createRoute;
