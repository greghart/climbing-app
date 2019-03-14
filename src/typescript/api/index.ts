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
import CommentablesService from './services/CommentablesService';
import AreasService from './services/AreasService';
import PolygonsService from './services/PolygonsService';
import PhotoablesService from './services/PhotoablesService';

const router = express.Router();

const swagger = buildSwagger();
router.get('/swagger.json', (req, res, next) => {
  res.json(swagger);
});
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swagger, {
  swaggerOptions: {
    docExpansion: 'none',
  },
}));
Server.buildServices(
  router,
  RoutesService,
  CragsService,
  AreasService,
  BouldersService,
  CommentablesService,
  PolygonsService,
  PhotoablesService
);

router.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.status(err.statusCode || 500).send(err.message);
});

router.use((req, res, next) => {
  res.status(404).send('API endpoint not found');
});

export default router;
