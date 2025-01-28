"use server";
import topoSchema from "@/app/api/_schemas/topo";
import formAction from "@/app/api/formAction";
import { getDataSource, PhotoSchema, TopogonSchema, TopoSchema } from "@/db";
import { ITopo } from "models";
import "server-only";
import { z } from "zod";

type Model = Pick<ITopo, "id" | "title" | "scale" | "topogons">;
type Meta = { photoId: number };
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
      if (data.id) {
        const topo = await tx.getRepository(TopoSchema).findOne({
          where: { id: data.id },
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
        topogons: data.topogons.map((topogon) => ({
          ...topogon,
          id: _resolveId(topogon.id),
          data: JSON.stringify(topogon.data) as any,
        })),
      };
      const saved = await tx.getRepository(TopoSchema).save(newTopo);

      return res.respond(saved, "Topo saved");
    });
  }
);

/**
 * resolveId handles the client sending clienty negative ids for new entities.
 */
function _resolveId(id: number | undefined): number {
  return id !== undefined && id > 0 ? id : (undefined as any);
}
export default putTopo;
