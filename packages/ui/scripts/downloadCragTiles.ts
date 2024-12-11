import resolveCrag from "@/app/api/resolveCrag";
import { CragSchema, getDataSource } from "@/db";
import * as tilebelt from "@mapbox/tilebelt";
import * as fs from "fs";
import * as _ from "lodash-es";
import { Bounds, Coordinate, Crag, IBounds } from "models";
import * as path from "path";
import { Readable } from "stream";

async function downloadCragTiles(cragId: number) {
  const ds = await getDataSource();
  const _crag = resolveCrag(
    await ds.getRepository(CragSchema).findOneBy({ id: cragId })
  );
  if (!_crag) {
    throw new Error(`crag ${cragId} not found`);
  }
  const crag = Crag.build(_crag);
  console.warn(crag, "got a crag");
  let bounds: IBounds;
  if (crag.bounds) {
    bounds = crag.bounds;
  } else {
    const boundCoords = toBounds(crag.center.lat, crag.center.lng, 450);
    bounds = new Bounds({
      topLeft: new Coordinate(boundCoords[0], boundCoords[1]),
      bottomRight: new Coordinate(boundCoords[2], boundCoords[3]),
    });
  }
  if (!bounds) {
    console.warn("no crag location found, skipping");
    return;
  }

  const tile = tilebelt.bboxToTile([
    bounds.topLeft.lng,
    bounds.topLeft.lat,
    bounds.bottomRight.lng,
    bounds.bottomRight.lat,
  ]);

  function getTilesForZoom(zoom: number) {
    const tileTopLeft = tilebelt.pointToTile(
      bounds.topLeft.lng,
      bounds.topLeft.lat,
      zoom
    );
    const tileBottomRight = tilebelt.pointToTile(
      bounds.bottomRight.lng,
      bounds.bottomRight.lat,
      zoom
    );
    return [tileTopLeft, tileBottomRight];
  }

  console.warn({ tile }, "Getting tiles to cover");
  const tilesToDownload = _.filter(
    getAllTiles(tile, 19, tile[2]),
    (thisTile) => {
      const [tileTopLeft, tileBottomRight] = getTilesForZoom(thisTile[2]);
      return (
        thisTile[0] >= tileTopLeft[0] &&
        thisTile[1] >= tileTopLeft[1] &&
        thisTile[0] <= tileBottomRight[0] &&
        thisTile[1] <= tileBottomRight[1]
      );
    }
  );

  console.warn({
    non_filter_count: getAllTiles(tile, 19, tile[2]).length,
    tile,
    bounds: bounds,
    bbox1: tilebelt.tileToBBOX(tile),
    geoJson: tilebelt.tileToGeoJSON(tile),
    tilesToDownload: tilesToDownload.length,
    tilesToDownload2: _.uniqBy(tilesToDownload, ([x, y, z]) => `${x}|${y}|${z}`)
      .length,
  });
  return prottle(5)(
    tilesToDownload.map((t) => {
      return async () => {
        const [x, y, z] = t;
        // Make path,then download and write
        const dir = path.resolve(
          __dirname,
          `../public/tiles/mapbox/${x}/${y}/`
        );
        fs.mkdirSync(dir, { recursive: true });
        const file = path.resolve(dir, `${z}.png`);
        if (fs.existsSync(file)) return;

        const res = await fetch(tileDownload(t));
        const readableStream = Readable.fromWeb(res.body! as any);
        const fileStream = fs.createWriteStream(file);
        readableStream.pipe(fileStream);
        return new Promise<void>((resolve) => {
          fileStream.on("close", () => {
            console.warn("Closed", file);
            resolve();
          });
        });
      };
    })
  );
}

function toBounds(lat: number, lng: number, sizeInMeters: number) {
  const latAccuracy = (180 * sizeInMeters) / 40075017;
  const lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * lat);

  return [
    lat - latAccuracy,
    lng - lngAccuracy,
    lat + latAccuracy,
    lng + lngAccuracy,
  ];
}

function getAllTiles(
  tile: tilebelt.Tile,
  maxZoom: number,
  currentZoom: number
): tilebelt.Tile[] {
  if (currentZoom >= maxZoom) {
    return [tile];
  }
  const nextTiles = tilebelt.getChildren(tile);
  return [tile]
    .concat(getAllTiles(nextTiles[0], maxZoom, currentZoom + 1))
    .concat(getAllTiles(nextTiles[1], maxZoom, currentZoom + 1))
    .concat(getAllTiles(nextTiles[2], maxZoom, currentZoom + 1))
    .concat(getAllTiles(nextTiles[3], maxZoom, currentZoom + 1));
}

function tileDownload(t: tilebelt.Tile) {
  // tslint:disable-next-line:max-line-length
  return `http://api.mapbox.com/v4/mapbox.satellite/${t[2]}/${t[0]}/${t[1]}@4x.png?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
}

function prottle<T>(concurrency: number) {
  if (concurrency <= 0) {
    throw new Error("concurrency must be greater than 0");
  }
  // batching into n/c batches, but then not at our limit like we want
  return async (inputs: (() => Promise<T>)[]) => {
    // use built in if we wouldn't reach limit anyways
    if (inputs.length <= concurrency) {
      return Promise.all(inputs.map((i) => i()));
    }
    const results = new Array<T>(inputs.length);

    let i = 0; // track index through inputs
    async function dequeue() {
      console.warn("dequeue", i);
      if (i >= inputs.length) {
        return;
      }
      const pending = inputs[i]();
      i += 1;
      results[i] = await pending;
      return dequeue();
    }
    return Promise.all(new Array(concurrency).fill(null).map(dequeue));
  };
}

// run
downloadCragTiles(55)
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    console.error("oh no");
    process.exit(1);
  });
