import * as t from 'io-ts';

import getSubmissionError from './getSubmissionError';

/**
 * Validate some input form data and attempt to decode it through some typing
 *
 * This is necessary because redux-form isn't totally typesafe with its' API.
 * That is, we don't know the data we get back necessarily.
 * It also acts as additional client-side validations
 */
const validate = <I, A>(comment: I, type: t.Decoder<I, A>): Promise<A> => {
  const result = type.decode(comment)
  return new Promise((resolve, reject) => {
    result.fold(
      (errors) => {
        reject(getSubmissionError(errors));
      },
      (data) => {
        resolve(data);
      }
    )
  });
}

export default validate;
