import * as t from "io-ts";
import { SubmissionError } from "redux-form";
import { filter, map, set } from "lodash-es";

/**
 * Normalize a ValidationError to a submission error
 *
 * Note,
 */
function normalizeError<A, I, O>(err: t.ValidationError) {
  // The first is the root, and we know it's not valid
  const contextWeCareAbout = err.context.slice(1);

  // Get the key to the validation that failed, to tag the form under
  // This gets tricky, as unions and refinements and such will be in
  // context but not affect the path
  // Current heuristic is filter out number keys, but that may affect
  // array validation if we ever get into that.
  const key = map(
    filter(contextWeCareAbout, (thisContext) => isNaN(Number(thisContext.key))),
    "key"
  ).join(".");

  // Get the actual type that failed, so we can show the right description
  // Generally this is the final type, but we need to break out the refinement
  // from its' base and the refinement itself failing.
  const finalType = contextWeCareAbout[contextWeCareAbout.length - 1].type;
  const actualType = (() => {
    if (!(finalType instanceof t.RefinementType)) {
      return finalType;
    }
    // If the refinement sub-type is valid, that means the refinement itself is what triggered
    if ((finalType as t.RefinementType<t.Type<A, O, I>>).type.is(err.value)) {
      return finalType;
    }
    // Otherwise the wrapped type is what triggered
    return finalType.type;
  })();

  // Get the message to float up
  // This should waterfall:
  //  1. The error message itself (already translated)
  //  2. Know types to be handled specially (to be translated)
  //  3. The name of the actual type (to be translated)
  //
  // Re #2 for example, an interface being the actual type implies it was left
  //  undefined. We don't want the name, which is the object descriptor.
  const message =
    err.message ||
    (actualType instanceof t.InterfaceType && "required") ||
    actualType.name;

  return {
    key,
    message,
    actualType,
  };
}

/**
 * Get a redux-form SubmissionError from an io-ts validation errors array
 */
function getSubmissionError<A, O, I>(errs: t.Errors): SubmissionError {
  console.warn("========================================");
  console.warn(errs);
  return new SubmissionError(
    errs.reduce(
      (memo, thisError) => {
        // TODO Add translation
        const { key, message } = normalizeError(thisError);
        set(memo, key, message);
        return memo;
      },
      { _error: "Client-side validations failed" }
    )
  );
}

export default getSubmissionError;
