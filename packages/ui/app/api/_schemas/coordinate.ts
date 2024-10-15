import { z } from "zod";

const coordinate = z.object({
  lat: z.number(),
  lng: z.number(),
});

export default coordinate;
