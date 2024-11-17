import { z } from "zod";

const coordinateSchema = z.object({
  id: z.number().optional(),
  lat: z.number(),
  lng: z.number(),
});

export const coordinateOptionalSchema = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});
export default coordinateSchema;
