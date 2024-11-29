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
export const baseJsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(literalSchema), z.record(literalSchema)])
);

// objects often come in as stringified json to support simple FormData format
export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<typeof baseJsonSchema> => {
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
  .transform((str, ctx): z.infer<typeof baseJsonSchema> | undefined => {
    if (str == null || str == undefined) return;
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

const jsonSchema = {
  literal: literalSchema,
  schema: baseJsonSchema,
  string: stringToJSONSchema,
  stringNullish: nullishStringToJSONSchema,
};
export default jsonSchema;
