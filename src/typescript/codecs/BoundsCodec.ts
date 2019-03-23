import * as t from 'io-ts';

const CoordinateCodec = t.type({
  lat: t.number,
  lng: t.number
});

const BoundsCodec = t.type({
  topLeft: CoordinateCodec,
  bottomRight: CoordinateCodec
});

export default BoundsCodec;
