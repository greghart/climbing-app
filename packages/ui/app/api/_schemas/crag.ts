import * as schemas from "@/app/api/_schemas";
import "server-only";
import { z } from "zod";

const cragSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(5, { message: "Must be 5 or more characters" })
    .optional(),
  description: z.string().optional(),
  trail: schemas.json.stringNullish.pipe(
    z
      .object({
        lines: z.array(schemas.line),
      })
      .optional()
  ),
  bounds: schemas.json.stringNullish.pipe(
    z
      .object({
        topLeft: schemas.coordinate,
        bottomRight: schemas.coordinate,
      })
      .optional()
  ),
});

export default cragSchema;
