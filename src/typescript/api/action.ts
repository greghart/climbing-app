import * as Promise from 'bluebird';
import * as express from 'express';

interface ObjectResponse {
  // Really we want anything that's serializable and can be passed to `res.json`
  // That's actually anything
  [index: string]: Response | number | string | boolean | any;
}
type Response = ObjectResponse | ObjectResponse[];
type Operation<T, Result extends Response = Response> =
  (args: T) => Result | Promise.Thenable<Result>;
type GetArgs<T> = (req: express.Request) => T;

function action<T, Result>(
  operation: Operation<T, Result>,
  getArgs: GetArgs<T>
): express.RequestHandler {
  return (req, res, next) => {
    const args: T = getArgs(req);
    return Promise.try<Response>(() => {
      return operation(
        args
      );
    })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      return next(err);
    });
  };
}

export default action;
export { Response, Operation, GetArgs };
