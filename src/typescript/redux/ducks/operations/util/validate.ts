import * as t from 'io-ts';
import defer = require('lodash/defer');

import getSubmissionError from './getSubmissionError';

/**
 * Validate some input form data and attempt to decode it through some typing
 *
 * This is necessary because redux-form isn't totally typesafe with its' API.
 * That is, we don't know the data we get back necessarily.
 * It also acts as additional client-side validations
 */
const validate = <A, O, I>(comment: I, type: t.Type<A, O, I>): Promise<A> => {
  const result = type.decode(comment)
  return new Promise((resolve, reject) => {
    result.fold(
      (errors) => {
        // Defer rejection to workaround devtools catching this
        defer(
          () => reject(getSubmissionError(errors))
        );
      },
      (data) => {
        resolve(data);
      }
    )
  });
}

/**
 * We also include some cusotm refinements that we want to re-use here.
 * @todo If this gets out of hand, refactor it
 */
const types = {
  minLength: t.refinement(t.string, text => text.length > 2, 'text.minLength'),
  numberFromString: new t.Type<number, string, unknown>(
    'numberFromString',
    (u): u is number => { return !isNaN(Number(u)); },
    (u, c) =>
      t.string.validate(u, c).chain(s => {
        if (isNaN(Number(s))) {
          return t.failure(u, c)
        }
        return t.success(Number(s));
      }),
    a => a.toString()
  ),
  integerFromString: new t.Type<number, string, unknown>(
    'integerFromString',
    (u): u is number => { return Number.isSafeInteger(Number(u)) },
    (u, c) =>
      types.numberFromString.validate(u, c).chain(n => {
        return Number.isSafeInteger(n) ?
          t.success(u) :
          t.failure(u, c)
      }),
    a => a.toString()
  )

}

export { types };
export default validate;
