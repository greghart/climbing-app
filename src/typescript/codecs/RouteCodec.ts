import * as t from 'io-ts';
import range from 'lodash/range';
import * as types from './util';

const validGrades = ['VB'].concat(range(16).map((i) => `V${i}`));
const RouteCodec = t.type({
  name: types.minLength,
  description: types.minLength,
  gradeRaw: t.refinement(
    t.string,
    (text) => validGrades.indexOf(text) > -1,
    'grade.valid',
  ),
  // Optional
  length: t.union([
    t.undefined,
    t.null,
    t.Integer,
    t.refinement(types.integerFromString, (h) => h <= 29029, 'length.tallerThanEverest'),
  ]),
  firstAscent: t.union([
    t.undefined,
    t.null,
    types.minLength,
  ]),
  coordinate: t.union([
    t.undefined,
    t.type({
      lat: t.number,
      lng: t.number,
    }),
  ]),
});

export default RouteCodec;
