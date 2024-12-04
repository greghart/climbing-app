import { AddAPhoto } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardMedia,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { IPhoto, IPhotoable } from "models";
import Link from "next/link";

interface Props {
  // A path to creating a new photo for this entity
  newRoute: string;
  photoable: IPhotoable;
}

function ShowPhotos(props: Props) {
  const photos = props.photoable.photos || [];
  return (
    <Stack>
      {photos.length === 0 && (
        <Typography variant="subtitle1">
          No photos yet. Be the first one!
        </Typography>
      )}
      {photos.map((thisPhoto) => {
        return <PhotoCard key={thisPhoto.id} photo={thisPhoto} />;
      })}
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

function PhotoCard(props: { photo: IPhoto }) {
  return (
    <Card>
      <CardHeader
        title={props.photo.title}
        subheader={props.photo.description}
      />
      <CardMedia
        component="img"
        height={200}
        image={`/uploads/photos/${props.photo.upload!.key}`}
        alt={props.photo.title}
      />
    </Card>
  );
}
export default ShowPhotos;
