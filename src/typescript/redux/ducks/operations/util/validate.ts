import * as t from 'io-ts';
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/function'
import defer from 'lodash/defer';

import getSubmissionError from './getSubmissionError';

/**
 * Validate some input form data and attempt to decode it through some typing
 *
 * This is necessary because redux-form isn't totally typesafe with its' API.
 * That is, we don't know the data we get back necessarily.
 * It also acts as additional client-side validations
 */
const validate = <A, O, I>(data: I, type: t.Type<A, O, I>): Promise<t.TypeOf<typeof type>> => {
  const result = type.decode(data);
  return new Promise((resolve, reject) => {
    pipe(
      result,
      fold(
        (errors) => {
          // Defer rejection to workaround devtools catching this
          defer(
            () => reject(getSubmissionError(errors)),
          );
        },
        (data) => {
          resolve(data);
        },
      )
    )
  });
};

export default validate;
