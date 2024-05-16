import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

const defaultOptions = {
  shallow: false,
} as const;

export const searchParamsParsers = {
  search: parseAsString.withDefault("").withOptions(defaultOptions),
  type: parseAsString.withDefault("any").withOptions(defaultOptions),
  shade: parseAsBoolean.withDefault(false).withOptions(defaultOptions),
  shadeHour: parseAsInteger.withOptions(defaultOptions),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
