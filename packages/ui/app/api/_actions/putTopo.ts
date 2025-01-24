"use server";
import topoSchema from "@/app/api/_schemas/topo";
import formAction from "@/app/api/formAction";
import { getDataSource, PhotoSchema, TopogonSchema, TopoSchema } from "@/db";
import { ITopo } from "models";
import "server-only";
import { z } from "zod";

type Model = Pick<ITopo, "title" | "topogons">;
type Meta = { photoId: number; topoId?: number };
const putTopo = formAction<Model, z.infer<typeof topoSchema>, Meta>(
  topoSchema,
  async (res, data, prevState) => {
    const ds = await getDataSource();
    return await ds.transaction(async (tx) => {
      const photo = await tx.getRepository(PhotoSchema).findOne({
        where: { id: prevState.meta.photoId },
      });
      if (!photo) return res.withErr("Photo to put topo into not found");

      // Remove any topogons that client has removed
      if (prevState.meta.topoId) {
        const topo = await tx.getRepository(TopoSchema).findOne({
          where: { id: prevState.meta.topoId },
          relations: ["topogons"],
        });
        if (!topo)
          return res.withErr("Topo not found, try refreshing the page");

        for (const topogon of topo.topogons!) {
          if (data.topogons.find((t) => t.id === topogon.id)) continue;
          await tx.getRepository(TopogonSchema).remove(topogon);
        }
      }

      const newTopo = {
        photo,
        ...data,
        id: _resolveId(prevState.meta.topoId),
        topogons: data.topogons.map((topogon) => ({
          ...topogon,
          id: _resolveId(topogon.id),
          data: JSON.stringify(topogon.data),
        })),
      };
      console.warn("Data", data);
      console.warn("Saving topo", newTopo);
      const saved = await tx.getRepository(TopoSchema).save(newTopo);

      return res.respond(saved, "Topo saved");
    });
  }
);

/**
 * resolveId handles the client sending clienty negative ids for new entities.
 */
function _resolveId(id: number | undefined) {
  return id !== undefined && id > 0 ? id : undefined;
}
export default putTopo;
