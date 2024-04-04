import * as t from "io-ts";
import { fold } from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import { PathReporter } from "io-ts/lib/PathReporter.js";
import { defer } from "lodash-es";
import { Errors } from "typescript-rest";

/**
 * Validate some input API data and attempt to decode it through some codec
 *
 * This is necessary because clients can send us whatever the hell they want
 * Note we don't need to have graceful errors here, as our typesafe client *should*
 * be setup correctly
 */
const validate = <A, O, I>(
  data: I,
  type: t.Type<A, O, I>
): Promise<t.TypeOf<typeof type>> => {
  const result = type.decode(data);
  return new Promise((resolve, reject) => {
    pipe(
      result,
      fold(
        (errors) => {
          // Defer rejection to workaround devtools catching this
          console.error({ data, type }, "API.validate");
          defer(() =>
            reject(
              new Errors.BadRequestError(
                `Invalid payload given to API! ${PathReporter.report(result)}`
              )
            )
          );
        },
        (data) => {
          resolve(data);
        }
      )
    );
  });
};

export default validate;
