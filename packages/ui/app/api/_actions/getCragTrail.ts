import associationer from "@/app/_util/associationer";
import { Crag, getDataSource } from "@/db";
import { ICrag } from "models";
import { cache } from "react";
import "server-only";

const getCragTrail = cache(async (id: number) => {
  const ds = await getDataSource();
  return ds
    .getRepository(Crag)
    .findOne({
      where: { id },
      relations: ["trail", "trail.lines"],
    })
    .then((crag) => {
      if (!crag) return null;
      return crag.trail;
    });
});

function resolveCragTrail(crag: ICrag) {
  return associationer(crag!.trail, () => getCragTrail(crag!.id!));
}

export { resolveCragTrail };
export default getCragTrail;
