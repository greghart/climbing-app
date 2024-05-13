"use client";
import useSearchParamsPath from "@/app/_components/useSearchParamsPath";
import { Link, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { IArea, IBoulder, ICrag, IRoute } from "models";
import NextLink from "next/link";

interface Props {
  crag: ICrag;
  area?: IArea;
  boulder?: IBoulder;
  route?: IRoute;
}

export default function Breadcrumbs(props: Props) {
  const searchParamsPath = useSearchParamsPath();
  return (
    <MUIBreadcrumbs>
      {props.crag && (
        <NextLink
          href={searchParamsPath(`/crags/${props.crag.id}/explorer`)}
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
            `/crags/${props.crag.id}/explorer/area/${props.area.id}`
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
            `/crags/${props.crag.id}/explorer/area/${props.area.id}/boulder/${props.boulder.id}`
          )}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.boulder.name}
          </Link>
        </NextLink>
      )}
      {props.area && props.boulder && props.route && (
        <NextLink
          href={searchParamsPath(
            `/crags/${props.crag.id}/explorer/area/${props.area.id}/boulder/${props.boulder.id}/route/${props.route.id}`
          )}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.route.name}
          </Link>
        </NextLink>
      )}
    </MUIBreadcrumbs>
  );
}
