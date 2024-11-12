import json from "@/app/api/_schemas/json";
import polygonSchema from "@/app/api/_schemas/polygon";
import { z } from "zod";

const boulderSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  polygon: json.stringNullish.pipe(polygonSchema).optional(),
});

export default boulderSchema;
