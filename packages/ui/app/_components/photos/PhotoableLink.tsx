import { Link, Typography } from "@mui/material";
import { IPhotoable } from "models";
import NextLink from "next/link";

export default function PhotoableLink({
  photoable,
}: {
  photoable: IPhotoable;
}) {
  let metadata: any = {};
  if (photoable.crag) {
    metadata = {
      type: "crag",
      link: `crags/${photoable.crag.id}`,
      name: photoable.crag.name,
    };
  }
  if (photoable.area) {
    metadata = {
      type: "area",
      link: `areas/${photoable.area.id}`,
      name: photoable.area.name,
    };
  }
  if (photoable.boulder) {
    metadata = {
      type: "boulder",
      link: `boulders/${photoable.boulder.id}`,
      name: photoable.boulder.name,
    };
  }
  if (photoable.route) {
    metadata = {
      type: "route",
      link: `routes/${photoable.route.id}`,
      name: photoable.route.name,
    };
  }
  return (
    <Typography variant="caption">
      For {metadata.type}
      <> </>
      <NextLink href={`/${metadata.link}/photos`} passHref legacyBehavior>
        <Link underline="hover" color="inherit">
          {metadata.name}
        </Link>
      </NextLink>
    </Typography>
  );
}
