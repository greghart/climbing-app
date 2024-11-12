import coordinate from "@/app/api/_schemas/coordinate";
import { z } from "zod";

const polygonSchema = z.object({
  id: z.number().optional(),
  coordinates: z.array(coordinate),
});

export default polygonSchema;
