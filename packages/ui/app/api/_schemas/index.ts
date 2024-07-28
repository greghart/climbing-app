import { z } from "zod";
export { default as json } from "./json";

export const coordinate = z.object({
  lat: z.number(),
  lng: z.number(),
});
