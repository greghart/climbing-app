import coordinateSchema from "@/app/api/_schemas/coordinate";
import jsonSchema from "@/app/api/_schemas/json";
import { z } from "zod";

const routeSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  coordinates: jsonSchema.stringNullish.pipe(coordinateSchema).optional(),
});

export default routeSchema;
