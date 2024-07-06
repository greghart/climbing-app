"use server";
import ApiResponse from "@/app/api/ApiResponse";
import { Crag, getDataSource } from "@/db";
import { ICrag } from "models";
import "server-only";
import { z } from "zod";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: Move reusable zods some place
const coordinate = z.object({
  lat: z.number(),
  lng: z.number(),
});
// Any given json (nabbed from zod docs)
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);
// objects often come in as stringified json to support simple FormData format
const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<typeof jsonSchema> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });
const nullishStringToJSONSchema = z
  .string()
  .nullish()
  .transform((str, ctx): z.infer<typeof jsonSchema> | undefined => {
    if (str == null || str == undefined) return;
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  bounds: nullishStringToJSONSchema.pipe(
    z
      .object({
        topLeft: coordinate,
        bottomRight: coordinate,
      })
      .optional()
  ),
});

class UpdateCragResponse extends ApiResponse<ICrag, z.infer<typeof schema>> {}
export type FormState = ReturnType<UpdateCragResponse["toJSON"]>;

async function updateCrag(prevState: FormState, data: FormData) {
  const res = new UpdateCragResponse().hydrate(prevState);

  const validatedFields = schema.safeParse({
    name: data.get("name"),
    description: data.get("description"),
    bounds: data.get("bounds"),
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
