import { SubmissionError } from "redux-form";

/**
 * Handle errors that arise during a redux-form pipeline.
 *
 * Ensures anything we don't expect still gets caught
 */
function handleReduxFormErrors(err: Error) {
  if (!(err instanceof SubmissionError)) {
    throw new SubmissionError({
      _error: err.message
    });
  }
  throw err;
}

export default handleReduxFormErrors;
