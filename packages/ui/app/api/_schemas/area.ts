import jsonSchema from "@/app/api/_schemas/json";
import polygonSchema from "@/app/api/_schemas/polygon";
import { z } from "zod";

const areaSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  polygon: jsonSchema.stringNullish.pipe(polygonSchema).optional(),
});

export default areaSchema;
