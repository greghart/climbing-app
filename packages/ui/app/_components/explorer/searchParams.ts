import { createSearchParamsCache, parseAsBoolean } from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsParsers = {
  overlay: parseAsBoolean.withDefault(false),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
