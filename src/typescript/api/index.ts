/**
 * The API powering the climbing app will for now be a simple express API router
 *
 * There has been some experimentation with utilizing OpenAPI and Swagger to build out
 * documented APIs (and alongside TypeScript that'd be neat), but it's not quite there yet
 */
import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { Server } from 'typescript-rest';
import RoutesService from './services/RoutesService';
import CragsService from './services/CragsService';
import BouldersService from './services/BouldersService';
import buildSwagger from './buildSwagger';

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

const swagger = buildSwagger();
router.get('/swagger.json', (req, res, next) => {
  res.json(swagger);
});
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swagger, {
  swaggerOptions: {
    docExpansion: 'none'
  }
}));
Server.buildServices(router, RoutesService, CragsService, BouldersService);

router.use((req, res, next) => {
  res.status(404).send('API endpoint not found');
});

export default router;
