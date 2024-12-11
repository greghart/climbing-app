"use client";
import React, { useActionState as reactUseActionState } from "react";

export default function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
): [
  state: Awaited<State>,
  dispatch: (payload: Payload) => void,
  {
    isPending: boolean;
    reqIndex: number;
  }
] {
  const [state, dispatch, isPending] = reactUseActionState(
    action,
    initialState,
    permalink
  );
  const [reqIndex, setReqIndex] = React.useState(0);
  React.useEffect(() => {
    setReqIndex((prev) => prev + 1);
  }, [state]);
  return [state, dispatch, { isPending, reqIndex }];
}
