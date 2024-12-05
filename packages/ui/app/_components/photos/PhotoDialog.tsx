"use client";
import PhotoCard from "@/app/_components/photos/PhotoCard";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { IPhoto } from "models";

/** PhotoDialog to be used for intercepted photo routes */
function PhotoDialog({ photo }: { photo: IPhoto }) {
  const handleClose = () => {
    window.history.back();
  };
  console.warn(photo.photoable);

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Photo '{photo.title}'</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">{photo.description}</Typography>
        <Typography variant="caption">
          TODO Link to {photo.photoable?.crag?.name}
        </Typography>
        <PhotoCard photo={photo} hideTitle />
      </DialogContent>
    </Dialog>
  );
}

export default PhotoDialog;
