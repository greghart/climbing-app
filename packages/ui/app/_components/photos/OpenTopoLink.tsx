import { Button, Link } from "@mui/material";
import { IPhoto } from "models";
import NextLink from "next/link";

export default function OpenTopoLink({ photo }: { photo: IPhoto }) {
  return (
    <Button>
      <NextLink href={`/photos/${photo.id}/topo`} passHref legacyBehavior>
        <Link underline="hover" color="inherit">
          Open Topo
        </Link>
      </NextLink>
    </Button>
  );
}
