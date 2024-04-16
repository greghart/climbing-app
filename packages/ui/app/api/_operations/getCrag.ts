import { cache } from "react";
import { getDataSource, Crag } from "@/db";
import "server-only";

const getCrag = cache(async (id: number | string) => {
  const ds = await getDataSource();
  // Crag IDs for client can also be name
  return ds.getRepository(Crag).findOne({
    where: [{ name: id as string }, { id: id as number }],
  });
});

export default getCrag;
