import * as t from 'io-ts';
import { SubmissionError } from 'redux-form';
import find = require('lodash/find');

/**
 * Get a redux-form SubmissionError from an io-ts validation errors array
 */
function getSubmissionError<A, O, I>(errs: t.Errors): SubmissionError {
  return new SubmissionError(
    errs.reduce(
      (memo, thisError) => {
        // Get the key we care about
        // There are lots of potential unions and refinements -- these are setup as arrays, so
        // just want the key that's not a number
        const key = find(
          thisError.context,
          (thisContext: any) =>
            isNaN(Number(thisContext.key))
        ).key
        // const key = thisError.context.map(({ key }) => key).join('.').replace(/\./g, '')
        console.warn(key, thisError);

        // Get the actual type -- this nets us more info
        // We want to drilldown
        const finalType = thisError.context[thisError.context.length-1].type;
        const actualType = (() => {
          if (!(finalType instanceof t.RefinementType)) {
            return finalType;
          }
          // If the refinement sub-type is valid, that means the refinement is what triggered
          if ((finalType as t.RefinementType<t.Type<A, O, I>>).type.is(thisError.value)) {
            return finalType;
          }
          return finalType.type;
        })();

        // TODO Add translation
        console.warn(actualType);
        const message = thisError.message || actualType.name;
        memo[key] = message;
        return memo
      },
      {}
    )
  )
};

export default getSubmissionError;
