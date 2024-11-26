"use client";
import useSearchParamsPath from "@/app/_util/useSearchParamsPath";
import { Info } from "@mui/icons-material";
import { Grid, Link, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { IArea, IBoulder, ICrag, IRoute } from "models";
import NextLink from "next/link";
import React from "react";

interface Props {
  crag: ICrag;
  area?: IArea;
  boulder?: IBoulder;
  route?: IRoute;
  cragHref?: string;
  cragIconHref?: string;
  cragIcon?: React.ReactNode;
  areaHref?: string;
  areaIconHref?: string;
  areaIcon?: React.ReactNode;
  boulderHref?: string;
  boulderIconHref?: string;
  boulderIcon?: React.ReactNode;
  routeHref?: string;
  routeIconHref?: string;
  routeIcon?: React.ReactNode;
}

function Centered(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>{props.left}</Grid>
      <Grid item>{props.right}</Grid>
    </Grid>
  );
}

export default function Breadcrumbs(props: Props) {
  const searchParamsPath = useSearchParamsPath();
  return (
    <MUIBreadcrumbs>
      {props.crag && (
        <Centered
          left={
            <NextLink
              href={searchParamsPath(
                props.cragHref || `/crags/${props.crag.id}/explorer`
              )}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.crag.name}
              </Link>
            </NextLink>
          }
          right={
            <NextLink
              href={props.cragIconHref || `/crags/${props.crag.id}`}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.cragIcon || <Info />}
              </Link>
            </NextLink>
          }
        />
      )}
      {props.area && (
        <Centered
          left={
            <NextLink
              href={searchParamsPath(
                props.areaHref ||
                  `/crags/${props.crag.id}/explorer/area/${props.area.id}`
              )}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.area.name}
              </Link>
            </NextLink>
          }
          right={
            <NextLink
              href={props.areaIconHref || `/areas/${props.area.id}`}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.areaIcon || <Info />}
              </Link>
            </NextLink>
          }
        />
      )}
      {props.area && props.boulder && (
        <Centered
          left={
            <NextLink
              href={searchParamsPath(
                props.boulderHref ||
                  `/crags/${props.crag.id}/explorer/area/${props.area.id}/boulder/${props.boulder.id}`
              )}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.boulder.name}
              </Link>
            </NextLink>
          }
          right={
            <NextLink
              href={props.boulderIconHref || `/boulders/${props.boulder.id}`}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.boulderIcon || <Info />}
              </Link>
            </NextLink>
          }
        />
      )}
      {props.area && props.boulder && props.route && (
        <Centered
          left={
            <NextLink
              href={searchParamsPath(
                props.boulderHref ||
                  `/crags/${props.crag.id}/explorer/area/${props.area.id}/boulder/${props.boulder.id}/route/${props.route.id}`
              )}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.route.name}
              </Link>
            </NextLink>
          }
          right={
            <NextLink
              href={props.routeIconHref || `/routes/${props.route.id}`}
              passHref
              legacyBehavior
            >
              <Link underline="hover" color="inherit">
                {props.routeIcon || <Info />}
              </Link>
            </NextLink>
          }
        />
      )}
    </MUIBreadcrumbs>
  );
}
