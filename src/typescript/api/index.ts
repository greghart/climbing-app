/**
 * The API powering the climbing app will for now be a simple express API router
 *
 * There has been some experimentation with utilizing OpenAPI and Swagger to build out
 * documented APIs (and alongside TypeScript that'd be neat), but it's not quite there yet
 */
import * as express from 'express';
import action from './action';
import getCrags from './routes/getCrags';
import getRoute from './routes/getRoute';

const router = express.Router();

// Extract id from request
const extractId = (req: express.Request) => {
  return req.params.id;
}
// Extract options from query
function extractQueryOptions<Options extends {}>(req: express.Request) {
  return req.query as Options;
}
// Extract multiple arguments
type Extract<R> = (req: express.Request) => R;
function extractTwo<R1, R2> (extractOne: Extract<R1>, extractTwo: Extract<R2>): Extract<[R1, R2]> {
  return (req: express.Request) => {
    return [
      extractOne(req),
      extractTwo(req)
    ];
  };
}

router.get('/crags', action(getCrags));
router.get('/route/:id', action(getRoute, extractTwo(extractId, extractQueryOptions)));

router.use(() => {
  console.log("WHAAAT");
});

export default router;
