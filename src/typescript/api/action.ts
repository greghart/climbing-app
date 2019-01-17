import * as Promise from 'bluebird';
import * as express from 'express';

interface ObjectResponse {
  // Really we want anything that's serializable and can be passed to `res.json`
  // That's actually anything
  [index: string]: Response | number | string | boolean | any;
}
type Response = ObjectResponse | ObjectResponse[];
type Operation<T, Result extends Response = Response> =
  (args?: T) => Result | Promise.Thenable<Result>;
type GetArgs<T> = (req: express.Request) => T;

function action<Result, T>(
  operation: Operation<T, Result>,
  getArgs?: GetArgs<T>
): express.RequestHandler {
  if (getArgs == undefined) {
    getArgs = () => { return undefined; };
  }
  return (req, res, next) => {
    return Promise.try<Response>(() => {
      return operation(
        getArgs(req)
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
