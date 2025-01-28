import jsonSchema from "@/app/api/_schemas/json";
import "server-only";
import { z } from "zod";

const topoSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(5).max(1000),
  scale: z.coerce.number(),
  topogons: jsonSchema.stringNullish.pipe(
    z
      .array(
        z
          .object({
            id: z.number().optional(),
            label: z.string().min(5).max(1000).optional(),
            data: z.any(),
            areaId: z.number().nullable().optional(),
            boulderId: z.number().nullable().optional(),
            routeId: z.number().nullable().optional(),
          })
          .refine(
            (topogon) => topogon.areaId || topogon.boulderId || topogon.routeId,
            "Topogon must belong to one of crag, boulder, or route"
          )
      )
      .nonempty()
  ),
});

export default topoSchema;
