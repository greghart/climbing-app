import coordinateSchema from "@/app/api/_schemas/coordinate";
import jsonSchema from "@/app/api/_schemas/json";
import { Grade } from "models";
import { z } from "zod";

// TODO: We support whatever gets parsed instead while there's so much noise
// const SUPPORTED_GRADE_SYSTEMS = [GradingSystemType.V, GradingSystemType.YDS];
// const GradeEnum = z.enum(Object.keys(grades[GradingSystemType.V]) as any);

const routeSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .min(4, { message: "Must be 4 or more characters" }),
  description: z.string().optional(),
  coordinates: jsonSchema.stringNullish.pipe(coordinateSchema).optional(),
  gradeRaw: z.string().refine((v) => {
    try {
      Grade.build(v);
    } catch (e) {
      return false;
    }
    return true;
  }, "Invalid grade format"),
});

export default routeSchema;
