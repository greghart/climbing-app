import isArray = require('lodash/isArray');
import { schema as NormalizrSchema } from 'normalizr';

type SchemaDescription = {
  // True will include the full sub-schema
  // False won't include the sub-schema at all
  // 'empty' will include it but without any sub-schemas of the sub-schema
  // an extra schmea description will recurse down
  // Defaults to false
  [index: string]: true | false | 'empty' | SchemaDescription;
};
export { SchemaDescription };

/**
 * Trim given normalizr schema to just certain sub-schemas.
 *
 * Useful when you know you just want to denormalize a subset of the full schema
 * @param {object} - Normalizr schema to trim
 * @param {object} - The schema we are selecting
 * @returns Normalizr schema with just given sub-schemas
 */
export default function selectNormalizr(
  schema: NormalizrSchema.Entity | [NormalizrSchema.Entity],
  query: SchemaDescription,
) {
  const selectedSchemas : { [index: string]: any } = {};
  const resolvedSchema = isArray(schema) ? schema[0] : schema;
  Object.keys(resolvedSchema.schema).forEach((thisKey) => {
    const thisQuery = query[thisKey] || false;
    if (thisQuery === true) {
      selectedSchemas[thisKey] = resolvedSchema.schema[thisKey];
    } else if (thisQuery === false) {
      // No-op
    } else if (thisQuery === 'empty') {
      selectedSchemas[thisKey] = selectNormalizr(
        resolvedSchema.schema[thisKey],
        {},
      );
    } else {
      selectedSchemas[thisKey] = selectNormalizr(
        resolvedSchema.schema[thisKey],
        thisQuery,
      );
    }
  });
  const newSchema = new NormalizrSchema.Entity(
    resolvedSchema.key,
    selectedSchemas,
    {
      idAttribute: resolvedSchema.idAttribute,
    },
  );

  return isArray(schema) ? [newSchema] : newSchema;
}
