"use client";

import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import SearchGroup from "../search/SearchGroup";

type Props = {
  href?: string;
  onClickPrepend?: React.MouseEventHandler<any>;
  prepend?: React.ReactNode;
} & Omit<React.ComponentProps<typeof SearchGroup>, "prepend">;

/**
 * A fixed header that has a backbutton prepend setup
 */
export default function GoBackHeader({
  href,
  onClickPrepend,
  ...props
}: Props) {
  const router = useRouter();
  const handleClickPrepend = React.useCallback(
    (e: any) => {
      if (onClickPrepend) {
        onClickPrepend(e);
      } else if (href) {
        router.push(href);
      } else {
        router.back();
      }
    },
    [onClickPrepend, router]
  );
  return (
    <SearchGroup
      prepend={
        href ? (
          <Link href={href}>
            <ArrowBack />
          </Link>
        ) : (
          <ArrowBack />
        )
      }
      {...props}
      onClickPrepend={handleClickPrepend}
    />
  );
}
