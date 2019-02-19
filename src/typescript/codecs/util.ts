import * as t from 'io-ts';

/**
 * Utility types
 * Type<A, I, O> --
 *   A -- Actual -- the actual type we want to encode, or decode something into
 *   I -- Input -- the input to decode back into A
 *   O -- Output -- the encoded value from A
 *   Often times, A and O will be the same -- that is, we wouldn't encode a number
 *     as a string by default. However, sometimes that may be useful, especially for
 *     types that need string serialization.
 *   Eg. DateString: <Date, string, string>. Decode ISOString -> Date. Encode Date -> ISOString
 */

export const minLength = t.refinement(t.string, text => text.length > 2, 'text.minLength');

export const numberFromString = new t.Type<number, string, unknown>(
  'numberFromString',
  (u): u is number => { return !isNaN(Number(u)); },
  (u, c) =>
    t.string.validate(u, c).chain(s => {
      if (isNaN(Number(s))) {
        return t.failure(u, c);
      }
      return t.success(Number(s));
    }),
  a => a.toString(),
);

export const integerFromString = t.refinement(
  numberFromString,
  t.Integer.predicate,
  'integerFromString',
);
