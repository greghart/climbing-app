import { Area, Boulder, Crag } from "models";
import { Link, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import NextLink from "next/link";

interface Props {
  crag: Crag;
  area?: Area;
  boulder?: Boulder;
}

export default function Breadcrumbs(props: Props) {
  return (
    <MUIBreadcrumbs>
      {props.crag && (
        <NextLink href={`/explorer/${props.crag.id}`} passHref legacyBehavior>
          <Link underline="hover" color="inherit">
            {props.crag.name}
          </Link>
        </NextLink>
      )}
      {props.area && (
        <NextLink
          href={`/explorer/${props.crag.id}/area/${props.area.id}`}
          passHref
          legacyBehavior
        >
          <Link underline="hover" color="inherit">
            {props.area.name}
          </Link>
        </NextLink>
      )}
    </MUIBreadcrumbs>
  );
}
