import * as t from 'io-ts';

export const minLength = t.refinement(t.string, text => text.length > 2, 'text.minLength');

export const numberFromString = new t.Type<number, string, unknown>(
  'numberFromString',
  (u): u is number => { return !isNaN(Number(u)); },
  (u, c) =>
    t.string.validate(u, c).chain(s => {
      if (isNaN(Number(s))) {
        return t.failure(u, c)
      }
      return t.success(Number(s));
    }),
  a => a.toString()
);

export const integerFromString = t.refinement(
  numberFromString,
  t.Integer.predicate,
  'integerFromString'
);
