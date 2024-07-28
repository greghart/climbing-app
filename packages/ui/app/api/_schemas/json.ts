import { z } from "zod";

// Any given json (nabbed from zod docs)
export const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

// objects often come in as stringified json to support simple FormData format
export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<typeof jsonSchema> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const nullishStringToJSONSchema = z
  .string()
  .nullish()
  .transform((str, ctx): z.infer<typeof jsonSchema> | undefined => {
    if (str == null || str == undefined) return;
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

const json = {
  literal: literalSchema,
  schema: jsonSchema,
  string: stringToJSONSchema,
  stringNullish: nullishStringToJSONSchema,
};
export default json;
