import coordinateSchema from "@/app/api/_schemas/coordinate";
import { z } from "zod";

const polygonSchema = z.object({
  id: z.number().optional(),
  coordinates: z.array(coordinateSchema),
});

export default polygonSchema;
