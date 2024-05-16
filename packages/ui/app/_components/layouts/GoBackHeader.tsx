"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import SearchGroup from "../search/SearchGroup";

interface Props {
  input: React.ReactNode;
  href?: string;
  onClickPrepend?: React.MouseEventHandler<any>;
}

/**
 * A fixed header that has a backbutton prepend setup
 */
export default function GoBackHeader(props: Props) {
  const router = useRouter();
  const handleClickPrepend = React.useCallback(
    (e: any) => {
      if (props.onClickPrepend) {
        props.onClickPrepend(e);
      } else if (props.href) {
        router.push(props.href);
      } else {
        router.back();
      }
    },
    [props.onClickPrepend, router]
  );
  return (
    <SearchGroup
      {...props}
      prepend={<i aria-hidden className="fa fa-arrow-left" />}
      onClickPrepend={handleClickPrepend}
    />
  );
}
