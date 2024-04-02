/**
 * The API powering the climbing app will for now be a simple express API router
 *
 * There has been some experimentation with utilizing OpenAPI and Swagger to build out
 * documented APIs (and alongside TypeScript that'd be neat), but it's not quite there yet
 */
import * as express from "express";
import * as swaggerUi from "swagger-ui-express";
import { Server } from "typescript-rest";
import RoutesService from "./services/RoutesService.js";
import CragsService from "./services/CragsService.js";
import BouldersService from "./services/BouldersService.js";
// import buildSwagger from "./buildSwagger.js";
import CommentablesService from "./services/CommentablesService.js";
import AreasService from "./services/AreasService.js";
import PolygonsService from "./services/PolygonsService.js";
import PhotoablesService from "./services/PhotoablesService.js";

const router = express.Router();

// const swagger = buildSwagger();
// router.get("/swagger.json", (req, res, next) => {
//   res.json(swagger);
// });
router.use("/docs", swaggerUi.serve);
// router.get(
//   "/docs",
//   swaggerUi.setup(swagger, {
//     swaggerOptions: {
//       docExpansion: "none",
//     },
//   })
// );
Server.buildServices(
  router as any,
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
  if (!res.headersSent) {
    res.status(404).send("API endpoint not found");
  }
});

export default router;
