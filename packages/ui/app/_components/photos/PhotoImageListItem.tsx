"use client";
import PhotoDeleteButton from "@/app/_components/photos/PhotoDeleteButton";
import {
  Box,
  ImageListItem,
  ImageListItemBar,
  Link,
  Slide,
  Typography,
} from "@mui/material";
import { IPhoto } from "models";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  photo: IPhoto;
  hideTitle?: boolean;
  hideDelete?: boolean;
}
function PhotoImageListItem(props: Props) {
  "use client";
  const showTitle = !Boolean(props.hideTitle);
  const showDelete = !Boolean(props.hideDelete);
  /** TODO:
   * Would be ideal to imagemagick on upload, or at run time, generate consistently sized photos for the grid
   */
  const params = useSearchParams();
  const card = (
    <ImageListItem>
      <Box
        sx={{
          position: "relative",
          height: "100%!important",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          style={{ width: "100%", height: "auto" }}
          srcSet={`/uploads/photos/${
            props.photo.upload!.key
          }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          src={`/uploads/photos/${
            props.photo.upload!.key
          }?w=164&h=164&fit=crop&auto=format`}
          alt={props.photo.title}
          loading="lazy"
        />
      </Box>
      {(showDelete || showTitle) && (
        <ImageListItemBar
          title={showTitle && props.photo.title}
          position="below"
          subtitle={
            showTitle && (
              <NextLink
                href={`/photos/${props.photo.id}/edit`}
                passHref
                legacyBehavior
              >
                <Link underline="hover" color="inherit">
                  <Typography variant="subtitle2">
                    <i>Edit photo</i>
                  </Typography>
                </Link>
              </NextLink>
            )
          }
          actionIcon={showDelete && <PhotoDeleteButton photo={props.photo} />}
        />
      )}
    </ImageListItem>
  );
  if (params.get("highlight") === props.photo.id!.toString()) {
    return (
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        {card}
      </Slide>
    );
  }
  return card;
}
export default PhotoImageListItem;
