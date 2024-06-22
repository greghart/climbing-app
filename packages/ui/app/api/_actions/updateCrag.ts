"use server";
import ApiResponse from "@/app/api/ApiResponse";
import { Crag, getDataSource } from "@/db";
import { ICrag } from "models";
import "server-only";
import { z } from "zod";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
});

class UpdateCragResponse extends ApiResponse<ICrag, z.infer<typeof schema>> {}
export type FormState = ReturnType<UpdateCragResponse["toJSON"]>;

async function updateCrag(prevState: FormState, data: FormData) {
  const res = new UpdateCragResponse().hydrate(prevState);

  if (Math.random() > 0.5) {
    return res.err("Random error").toJSON();
  }

  const validatedFields = schema.safeParse({
    name: data.get("name"),
    description: data.get("description"),
  });
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return res.zerr(validatedFields).toJSON();
  }

  const ds = await getDataSource();
  const saved = await ds.transaction(async (transactionalEntityManager) => {
    const crag = await transactionalEntityManager
      .getRepository(Crag)
      .findOneBy({ id: prevState.data!.id });
    if (!crag) {
      return undefined;
    }
    await delay(500);
    Object.assign(crag, validatedFields.data);
    return transactionalEntityManager.getRepository(Crag).save(crag);
  });
  if (!saved) {
    return res.err("crag not found").toJSON();
  }
  return res.respond(saved, "Crag updated").toJSON();
  // return await myDataSource.transaction((transactionalEntityManager) => {
  //   return (
  //     Promise.resolve()
  //       // Setup trail if necessary
  //       .then(async () => {
  //         if (data.trail) {
  //           console.warn("setting trail");
  //           return setTrail(
  //             await myDataSource.manager
  //               .withRepository(TrailRepository)
  //               .findOrGetTrail(crag),
  //             data.trail.nodes
  //           );
  //         }
  //       })
  //       // Setup bounds if necessary
  //       .then(async () => {
  //         if (!data.bounds) {
  //           return;
  //         }
  //         const bounds = crag.bounds || new Bounds();
  //         bounds.topLeft = new Coordinate(
  //           data.bounds.topLeft.lat,
  //           data.bounds.topLeft.lng
  //         );
  //         bounds.bottomRight = new Coordinate(
  //           data.bounds.bottomRight.lat,
  //           data.bounds.bottomRight.lng
  //         );
  //         bounds.crag = crag;
  //         await transactionalEntityManager.save(bounds);
  //         delete bounds.crag;
  //         crag.bounds = bounds;
  //       })
  //       .then(() => {
  //         Object.assign(crag, omit(data, "trail", "bounds"));
  //         debug({ crag }, "save");
  //         return transactionalEntityManager.save(crag);
  //       })
  //   );
  // });
}

export default updateCrag;
