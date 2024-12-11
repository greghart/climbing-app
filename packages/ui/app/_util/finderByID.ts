import { notFound } from "next/navigation";

/**
 * Returns a finder that tries to find an entity by param-y id, or 404s
 */
function finderByID<Entity>(getter: (id: number) => Promise<Entity>) {
  return async (_id: string) => {
    const id = Number(_id);
    if (!Number.isInteger(id)) notFound();

    const entity = await getter(id);
    if (!entity) notFound();

    return entity!;
  };
}

export default finderByID;
