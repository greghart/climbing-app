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

const extractId = (req: express.Request) => {
  return req.params.id;
}

router.get('/crags', action(getCrags));
router.get('/route/:id', action(getRoute, extractId));

router.use(() => {
  console.log("WHAAAT");
});

export default router;
