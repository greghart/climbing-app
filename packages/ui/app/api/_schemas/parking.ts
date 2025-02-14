import coordinateSchema from "@/app/api/_schemas/coordinate";
import jsonSchema from "@/app/api/_schemas/json";
import { z } from "zod";

const parkingSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  location: jsonSchema.string.pipe(coordinateSchema),
});

export default parkingSchema;
