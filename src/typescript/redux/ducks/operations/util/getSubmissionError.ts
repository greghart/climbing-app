import * as t from 'io-ts';
import { SubmissionError } from 'redux-form';

/**
 * Get a redux-form SubmissionError from an io-ts validation errors array
 */
const getSubmissionError = (errs: t.Errors): SubmissionError => {
  return new SubmissionError(
    errs.reduce(
      (memo, thisErr) => {
        const key = thisErr.context[thisErr.context.length-1].key;
        // const key = thisErr.context.map(({ key }) => key).join('.').replace(/\./g, '')
        const message = thisErr.message || thisErr.context[thisErr.context.length-1].type.name;
        // TODO Add translation
        memo[key] = message;
        return memo
      },
      {}
    )
  )
};

export default getSubmissionError;
