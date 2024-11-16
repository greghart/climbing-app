import { z } from "zod";

const coordinateSchema = z.object({
  id: z.number().optional(),
  lat: z.number(),
  lng: z.number(),
});

export default coordinateSchema;
