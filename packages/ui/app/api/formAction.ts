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
  Schema extends Partial<Model>,
  Meta = {}
>(
  schema: z.SomeZodObject,
  action: (
    res: ApiResponse<Model, Schema, Meta>,
    data: Schema
  ) => Promise<ApiResponse<Model, Schema, Meta>>
): formActionHandler<Model, Schema, Meta> {
  class Response extends ApiResponse<Model, Schema, Meta> {}

  return async (
    prevState: IApiResponse<Model, Schema, Meta>,
    formData: FormData
  ) => {
    const res = new Response(prevState);

    const data = Array.from(formData.entries()).reduce((acc, [key, value]) => {
      // Next.js metadata
      if (key.startsWith("$ACTION")) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {} as any);

    const validatedFields = schema.safeParse(data) as z.SafeParseReturnType<
      Schema,
      Schema
    >;

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return res.zerr(validatedFields).toJSON();
    }
    return (await action(res, validatedFields.data)).toJSON();
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
