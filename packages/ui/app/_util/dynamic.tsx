"use client";

import type { DynamicOptions, Loader } from "next/dynamic";
import _dynamic from "next/dynamic";

function dynamic<P = {}>(
  fn: Loader<P> | DynamicOptions<P>,
  options?: DynamicOptions<P>
) {
  return _dynamic(fn, {
    loading: () => <p>Javascript support needed</p>,
    ...options,
  });
}

export default dynamic;
