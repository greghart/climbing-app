import associationer from "@/app/_util/associationer";
import { CragSchema, getDataSource } from "@/db";
import { ICrag } from "models";
import { cache } from "react";
import "server-only";

// Separated out for performance.
const getCragTrail = cache(async (id: number) => {
  const ds = await getDataSource();
  return ds
    .getRepository(CragSchema)
    .findOne({
      where: { id },
      relations: ["trail", "trail.lines"],
    })
    .then((crag) => {
      if (!crag) return undefined;
      return crag.trail;
    });
});

function resolveCragTrail(crag: ICrag) {
  return associationer(crag!.trail, () => getCragTrail(crag!.id!));
}

export { resolveCragTrail };
export default getCragTrail;
