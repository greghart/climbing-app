import { createSearchParamsCache, parseAsString } from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsParsers = {
  search: parseAsString.withDefault("").withOptions({ shallow: false }),
  type: parseAsString.withDefault("any").withOptions({ shallow: false }),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
