import { z } from "zod";

// TODO: Decide how much we want the operation (or action in Next.js terms)
// to dictate the behavior of the component that uses it, and vice versa.
// Eg. should we return a full payload every time to let client blindly update,
// or rely on client doing updates

export interface IApiResponse<Model, Schema> {
  // If ok, data should be provided
  // If not ok, errors should be provided
  ok: boolean;
  data?: Model; // Model data
  message?: string; // Top level message, if any
  fieldErrors?: z.typeToFlattenedError<Schema>["fieldErrors"]; // Field level errors
  errors?: Array<string>; // Top level errors unrelated to field
}

// Simple builder class for responses
interface ApiResponse<Model, Schema extends Partial<Model>>
  extends Omit<IApiResponse<Model, Schema>, "data"> {}

class ApiResponse<Model, Schema> {
  _data?: Model;
  constructor() {
    this.ok = true;
    this.fieldErrors = {}; // Leave empties for easier usage
    this.errors = [];
  }

  // hydrate from prev state
  hydrate(prevState: IApiResponse<Model, Schema>) {
    // we want to keep prev form data, even if we return an error
    if (prevState.data) this.data(prevState.data);
    return this;
  }

  // respond with a normal successful response
  respond(data: Model, msg: string, ok: boolean = true) {
    this.ok = ok;
    this.data(data);
    return this.msg(msg);
  }

  data(data: Model) {
    this._data = data;
  }

  msg(msg: string) {
    this.message = msg;
    return this;
  }

  zerr(fields: z.SafeParseReturnType<Schema, Schema>) {
    const flatten = fields.error!.flatten();
    this.fieldErrors = flatten.fieldErrors;
    this.errors = (this.errors || []).concat(flatten.formErrors);
    return this;
  }

  err(err: string) {
    this.errors = (this.errors || []).concat([err]);
    return this;
  }

  toJSON(): IApiResponse<Model, Schema> {
    return {
      ok: this.ok,
      data: this._data,
      message: this.message,
      fieldErrors: this.fieldErrors,
      errors: this.errors,
    };
  }
}

export default ApiResponse;
