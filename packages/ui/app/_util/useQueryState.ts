"use client";

import { debounce } from "lodash-es";
import {
  UseQueryStateOptions,
  UseQueryStateReturn,
  useQueryState as nuqsUseQueryState,
} from "nuqs";
import React from "react";

/**
 * Our version of useQueryState which supports `debounceMs` option.
 * Only typed for parser format but will work with anything.
 * Updates react immediately, but debounces the query and server update
 */
function useQueryState<T>(
  key: string,
  options: UseQueryStateOptions<T> & {
    defaultValue: T;
  },
  debounceMs = 350
): UseQueryStateReturn<
  NonNullable<ReturnType<typeof options.parse>>,
  typeof options.defaultValue
> {
  const [valueQs, setQs] = nuqsUseQueryState<T>(key, options);
  const [valueReact, setReact] = React.useState<T | null>(valueQs);
  const debouncedSetQs = React.useCallback(debounce(setQs, debounceMs), [
    setQs,
  ]);
  const set = (newValue: any) => {
    setReact(newValue);
    debouncedSetQs(newValue);
  };
  return [valueReact as typeof valueQs, set as typeof setQs];
}

export default useQueryState;
