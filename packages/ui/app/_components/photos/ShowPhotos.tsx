"use client";
import PhotoCard from "@/app/_components/photos/PhotoCard";
import { AddAPhoto } from "@mui/icons-material";
import {
  ImageList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IPhotoable } from "models";
import Link from "next/link";

interface Props {
  // A path to creating a new photo for this entity
  newRoute: string;
  photoable: IPhotoable;
}

function ShowPhotos(props: Props) {
  const photos = props.photoable.photos || [];
  const bigEnough = useMediaQuery(useTheme().breakpoints.up("sm"));
  return (
    <Stack>
      {photos.length === 0 && (
        <Typography variant="subtitle1">
          No photos yet. Be the first one!
        </Typography>
      )}
      <ImageList
        sx={{
          width: "100%",
          minHeight: 480,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        cols={bigEnough ? 3 : 1}
        rowHeight={bigEnough ? 240 : 164}
      >
        {photos.map((thisPhoto) => (
          <PhotoCard key={thisPhoto.upload!.key} photo={thisPhoto} />
        ))}
      </ImageList>
      <Link href="photos/new">
        <ListItemButton>
          <ListItemIcon>
            <AddAPhoto />
          </ListItemIcon>
          <ListItemText primary="Add Photo" />
        </ListItemButton>
      </Link>
    </Stack>
  );
}

export default ShowPhotos;
