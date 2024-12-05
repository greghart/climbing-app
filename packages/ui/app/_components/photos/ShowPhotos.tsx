"use client";
import PhotoImageListItem from "@/app/_components/photos/PhotoImageListItem";
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
  const small = useMediaQuery(useTheme().breakpoints.down("xs"));
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
        cols={small ? 1 : 3}
        rowHeight={small ? 164 : 240}
      >
        {photos.map((thisPhoto) => (
          <PhotoImageListItem key={thisPhoto.upload!.key} photo={thisPhoto} />
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
