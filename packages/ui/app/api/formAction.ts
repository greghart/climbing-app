import ApiResponse, { IApiResponse } from "@/app/api/ApiResponse";
import "server-only";
import { z } from "zod";

/**
 * By convention, every client compatible action should have:
 * * `Model` The model or resource that we're affecting. Ie. read data
 * * `Schema` A zod schema for the form. Ie. write data, a subset of read data
 * * `Meta` any metadata unrelated to the model, such as container ids
 * * `XYZResponse` An ApiResponse class representing the full form state
 */
export default function formAction<
  Model,
  Schema extends Partial<Record<keyof Model, any>>,
  Meta = {}
>(
  schema: z.SomeZodObject | null,
  action: (
    res: ApiResponse<Model, Schema, Meta>,
    data: Schema,
    prevState: IApiResponse<Model, Schema, Meta>
  ) => Promise<ApiResponse<Model, Schema, Meta>>
): formActionHandler<Model, Schema, Meta> {
  class Response extends ApiResponse<Model, Schema, Meta> {}

  return async (
    prevState: IApiResponse<Model, Schema, Meta>,
    formData: FormData
  ) => {
    const res = new Response(prevState);

    try {
      const data = Array.from(formData.entries()).reduce(
        (acc, [key, value]) => {
          // Next.js metadata
          if (key.startsWith("$ACTION")) {
            return acc;
          }
          acc[key] = value;
          return acc;
        },
        {} as any
      );

      // Validation is opt-in
      if (!schema) {
        return (await action(res, data, prevState)).toJSON();
      }
      const validatedFields = schema.safeParse(data) as z.SafeParseReturnType<
        Schema,
        Schema
      >;

      // Return early if the form data is invalid
      if (!validatedFields.success) {
        return res.withData(data).withZerr(validatedFields).toJSON();
      }
      return (await action(res, validatedFields.data, prevState)).toJSON();
    } catch (err: any) {
      // TODO: This is a quick workaround -- next/navigation redirect throws an error
      // as a signal -- we should either re-throw it, or handle redirects in our layer to
      // and call it directly here outside the try
      if (err.message === "NEXT_REDIRECT") {
        throw err;
      }
      return res.withErr(err.toString()).toJSON();
    }
  };
}

export type formActionHandler<
  Model,
  Schema extends Partial<Model>,
  Meta = {}
> = (
  prevState: IApiResponse<Model, Schema, Meta>,
  formData: FormData
) => Promise<IApiResponse<Model, Schema, Meta>>;
