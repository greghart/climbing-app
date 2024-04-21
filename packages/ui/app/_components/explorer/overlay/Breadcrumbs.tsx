"use client";
import { IArea, IBoulder, ICrag } from "models";
import { Link, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import NextLink from "next/link";
import useSearchParamsPath from "@/app/_components/useSearchParamsPath";

interface Props {
  crag: ICrag;
  area?: IArea;
  boulder?: IBoulder;
}

export default function Breadcrumbs(props: Props) {
  const searchParamsPath = useSearchParamsPath();
  return (
    <MUIBreadcrumbs>
      {props.crag && (
        <NextLink
          href={searchParamsPath(`/explorer/${props.crag.id}`)}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.crag.name}
          </Link>
        </NextLink>
      )}
      {props.area && (
        <NextLink
          href={searchParamsPath(
            `/explorer/${props.crag.id}/area/${props.area.id}`
          )}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.area.name}
          </Link>
        </NextLink>
      )}
      {props.area && props.boulder && (
        <NextLink
          href={searchParamsPath(
            `/explorer/${props.crag.id}/area/${props.area.id}/boulder/${props.boulder.id}`
          )}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.boulder.name}
          </Link>
        </NextLink>
      )}
    </MUIBreadcrumbs>
  );
}
