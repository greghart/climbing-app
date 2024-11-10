import { z } from "zod";

const coordinate = z.object({
  id: z.number().optional(),
  lat: z.number(),
  lng: z.number(),
});

export default coordinate;
