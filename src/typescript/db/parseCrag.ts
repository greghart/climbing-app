import Crag from "../models/Crag.js";
import Coordinate from "../models/Coordinate.js";
import Area from "../models/Area.js";
import Boulder from "../models/Boulder.js";
import Route from "../models/Route.js";
import Polygon from "../models/Polygon.js";
import PolygonCoordinate from "../models/PolygonCoordinate.js";
import _debug from "../debug.js";
const debug = _debug.extend("db/parseCrag");

function parseCrag(obj: any) {
  const crag = new Crag();
  crag.name = obj.name;
  crag.defaultZoom = obj.zoom;
  crag.minZoom = obj.minZoom;
  crag.maxZoom = obj.maxZoom;
  crag._center = {
    lat: obj.centerLat,
    lng: obj.centerLng,
  };
  crag.areas = obj.areas.map((thisArea: any, i) => {
    const area = new Area();
    area.name = thisArea.name;
    area.polygon = new Polygon();
    area.polygon.descriptor = `area-${i + 1}`;
    area.polygon.coordinates = (thisArea.coordinates || []).map(
      (thisCoordinate: [number, number], i) => {
        const [lng, lat] = thisCoordinate;
        const pc = new PolygonCoordinate(lat, lng);
        pc.order = i;
        return pc;
      }
    );
    area.boulders = (thisArea.boulders || []).map((thisBoulder: any) => {
      const boulder = new Boulder();
      boulder.name = thisBoulder.name;
      boulder.coordinate = new Coordinate(
        thisBoulder.coordinates[0],
        thisBoulder.coordinates[1]
      );
      boulder.routes = (thisBoulder.routes || []).map((thisRoute: any) => {
        const route = new Route();
        route.name = thisRoute.name;
        route.gradeRaw = thisRoute.grade;
        return route;
      });
      return boulder;
    });
    return area;
  });

  debug(crag, "crag time");
  return crag;
}

export default parseCrag;
