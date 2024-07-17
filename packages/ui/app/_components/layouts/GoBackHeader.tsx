"use client";

import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import SearchField from "../search/SearchField";

type Props = {
  Component?: React.FC<any>;
  href?: string;
  onClickPrepend?: React.MouseEventHandler<any>;
  prepend?: React.ReactNode;
} & Omit<React.ComponentProps<typeof SearchField>, "prepend">;

/**
 * A fixed header that has a backbutton prepend setup
 */
export default function GoBackHeader({
  Component = SearchField,
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
    <Component
      {...props}
      prepend={
        href ? (
          <Link href={href}>{props.prepend || <ArrowBack />}</Link>
        ) : (
          props.prepend || <ArrowBack />
        )
      }
      onClickPrepend={handleClickPrepend}
    />
  );
}
