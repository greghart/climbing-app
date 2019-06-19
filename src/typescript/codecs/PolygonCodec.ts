import * as t from 'io-ts';

// We need three points to make a polygon
interface ThreePointsPolygonBrand {
  readonly ThreePointsPolygon: unique symbol;
}
const ThreePointsPolygon = t.brand(
  t.array(
    t.type({
      lat: t.number,
      lng: t.number,
      order: t.number,
    })
  ),
  ((coords): coords is t.Branded<any, ThreePointsPolygonBrand> => {
    return coords.length > 2;
  }),
  'three_points_polygon'
);

const PolygonCodec = t.type({
  coordinates: ThreePointsPolygon
});

export default PolygonCodec;
