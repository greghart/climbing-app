import * as fs from 'fs';
import * as request from 'request-promise';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import Bluebird from 'bluebird';
import * as tilebelt from 'tilebelt';
import * as _ from 'lodash';
import { getRepository } from 'typeorm';

import getConnection from '../src/typescript/db';
import Crag from '../src/typescript/models/Crag';
import _debug from '../src/typescript/debug';
const debug = _debug.extend('/home/elchocolato/Checkouts/climbing-app/tools/download_crag_tiles');

function download(uri, filename, callback) {
  request.head(uri, (err, res, body) => {
    debug('content-type:', res.headers['content-type']);
    debug('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}
const downloadAsync = Bluebird.promisify(download);

function toBounds(lat: number, lng: number, sizeInMeters: number) {
  const latAccuracy = 180 * sizeInMeters / 40075017;
  const lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * lat);

  return [
    lat - latAccuracy,
    lng - lngAccuracy,
    lat + latAccuracy,
    lng + lngAccuracy
  ];
}

function getAllTiles(tile: number[], maxZoom: number, currentZoom: number) {
  if (currentZoom >= maxZoom) {
    return [tile];
  }
  const nextTiles = tilebelt.getChildren(tile);
  return [tile]
  .concat(
    getAllTiles(
      nextTiles[0],
      maxZoom,
      currentZoom + 1
    )
  )
  .concat(
    getAllTiles(
      nextTiles[1],
      maxZoom,
      currentZoom + 1
    )
  )
  .concat(
    getAllTiles(
      nextTiles[2],
      maxZoom,
      currentZoom + 1
    )
  )
  .concat(
    getAllTiles(
      nextTiles[3],
      maxZoom,
      currentZoom + 1
    )
  );
}

function tileDownload(x, y, z) {
  // tslint:disable-next-line:max-line-length
  return `http://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}@2x.png?access_token=pk.eyJ1IjoiZWxjaG9jb2xhdG8iLCJhIjoiY2pzcWZ3ZXlxMGMyZjQzcnplZjR3Zmp1MSJ9.6xK9xxEQfavcSmfFEohQXA`;
}
async function downloadCragTiles(cragId: number) {
  const crag = await getRepository(Crag).findOne(cragId, { relations: ['bounds'] });
  console.warn(crag, 'got a crag');
  // const bounds = toBounds(
  //   crag.center.lat,
  //   crag.center.lng,
  //   450
  // );

  const tile = tilebelt.bboxToTile([
    crag.bounds.topLeft.lng,
    crag.bounds.topLeft.lat,
    crag.bounds.bottomRight.lng,
    crag.bounds.bottomRight.lat,
  ]);
  function getTilesForZoom(zoom: number) {
    const tileTopLeft = tilebelt.pointToTile(
      crag.bounds.topLeft.lng,
      crag.bounds.topLeft.lat,
      zoom
    );
    const tileBottomRight = tilebelt.pointToTile(
      crag.bounds.bottomRight.lng,
      crag.bounds.bottomRight.lat,
      zoom
    );
    return [tileTopLeft, tileBottomRight];
  }
  const tilesToDownload = _.filter(
    getAllTiles(tile, 19, tile[2]),
    (thisTile) => {
      const [tileTopLeft, tileBottomRight] = getTilesForZoom(thisTile[2]);
      return (
        thisTile[0] <= tileTopLeft[0] &&
        thisTile[1] >= tileTopLeft[1] &&
        thisTile[0] >= tileBottomRight[0] &&
        thisTile[1] <= tileBottomRight[1]
      );
    }
  );

  debug({
    tile,
    zoom18: getTilesForZoom(18),
    bounds: crag.bounds,
    bbox1: tilebelt.tileToBBOX(tile),
    geoJson: tilebelt.tileToGeoJSON(tile),
    tilesToDownload: tilesToDownload.length,
    tilesToDownload2: _.uniqBy(tilesToDownload, ([x, y, z]) => `${x}|${y}|${z}`).length
  });
  // return;
  return Bluebird.map(
    tilesToDownload,
    // [tile],
    ([x, y, z]) => {
      console.warn('Downloading', tileDownload(x, y, z));
      return (Bluebird.promisify(mkdirp) as any)(
        path.resolve(__dirname, `../static/tiles/${x}/${y}/`)
      )
      .then(() => {
        return downloadAsync(
          tileDownload(x, y, z),
          path.resolve(__dirname, `../static/tiles/${x}/${y}/${z}.png`),
        );
      });
      // .then(() => {
      //   return request.get(
      //     tileDownload(x, y, z)
      //   );
      // })
      // .then((tileData) => {
      // })
      // .then((tileData) => {
      //   return writeAsync(
      //     path.resolve(__dirname, `../static/tiles/${x}/${y}/${z}.png`),
      //     tileData
      //   );
      // });
    },
    { concurrency: 5 }
  );
}

getConnection()
.then(() => {
  return downloadCragTiles(2);
})
.then(() => {
  debug('Success!');
})
.catch((err) => {
  console.error(err);
  console.error('oh no');
  process.exit(1);
});
