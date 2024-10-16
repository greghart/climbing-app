import coordinate from "@/app/api/_schemas/coordinate";
import { z } from "zod";

const lineSchema = z.object({
  id: z.number().optional(),
  start: coordinate,
  end: coordinate,
});

export default lineSchema;
