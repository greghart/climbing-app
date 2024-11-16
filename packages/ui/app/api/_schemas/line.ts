import coordinateSchema from "@/app/api/_schemas/coordinate";
import { z } from "zod";

const lineSchema = z.object({
  id: z.number().optional(),
  start: coordinateSchema,
  end: coordinateSchema,
});

export default lineSchema;
