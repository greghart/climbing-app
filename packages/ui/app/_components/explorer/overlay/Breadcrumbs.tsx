import { Area, Boulder, Crag } from "models";
import { Link, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import NextLink from "next/link";

interface Props {
  crag: Crag;
  area?: Area;
  boulder?: Boulder;
  overlay: boolean;
}

// TODO: Query param updates to overlay don't make it to server (of course)
export default function Breadcrumbs(props: Props) {
  return (
    <MUIBreadcrumbs>
      {props.crag && (
        <NextLink
          href={`/explorer/${props.crag.id}?overlay=${props.overlay}`}
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
          href={`/explorer/${props.crag.id}/area/${props.area.id}?overlay=${props.overlay}`}
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
          href={`/explorer/${props.crag.id}/area/${props.area.id}/boulder/${props.boulder.id}?overlay=${props.overlay}`}
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
