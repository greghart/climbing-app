import * as t from 'io-ts';

const PolygonCodec = t.type({
  coordinates: t.array(
    t.type({
      lat: t.number,
      lng: t.number,
      order: t.number,
    }),
  ),
});

export default PolygonCodec;
