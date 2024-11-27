import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsString,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsParsers = {
  overlay: parseAsBoolean.withDefault(false),
  tileLayer: parseAsString.withDefault("MapBox"),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
