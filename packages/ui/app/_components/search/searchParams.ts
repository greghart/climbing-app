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
  // TODO: Nicety, get users' current hour as default
  shadeHour: parseAsInteger.withDefault(12).withOptions(defaultOptions),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
