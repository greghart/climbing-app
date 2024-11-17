"use server";
import routeSchema from "@/app/api/_schemas/route";
import formAction from "@/app/api/formAction";
import { Route, getDataSource } from "@/db";
import { IRoute } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = Pick<IRoute, "name" | "description" | "coordinates" | "gradeRaw">;
type Meta = { id: number };
const updateRoute = formAction<Model, z.infer<typeof routeSchema>, Meta>(
  routeSchema,
  async (res, data) => {
    const ds = await getDataSource();
    const route = await ds.getRepository(Route).findOne({
      where: { id: res.meta.id },
    });
    if (!route) return res.err(`route ${res.meta.id} not found`);

    Object.assign(route, data);

    const saved = await ds.transaction(async (transactionalEntityManager) => {
      return transactionalEntityManager.getRepository(Route).save(route);
    });

    redirect(`/routes/${saved.id}`);
  }
);

export default updateRoute;
