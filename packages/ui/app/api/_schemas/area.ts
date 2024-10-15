import coordinate from "@/app/api/_schemas/coordinate";
import json from "@/app/api/_schemas/json";
import { z } from "zod";

const areaSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" }),
  description: z.string().optional(),
  polygon: json.stringNullish
    .pipe(
      z.object({
        coordinates: z.array(coordinate),
      })
    )
    .optional(),
});

export default areaSchema;
