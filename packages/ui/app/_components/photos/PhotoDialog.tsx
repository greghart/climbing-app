"use client";
import PhotoImageListItem from "@/app/_components/photos/PhotoImageListItem";
import UpdatePhotoForm from "@/app/_components/photos/UpdatePhotoForm";
import getPhotoRedirect from "@/app/_util/getPhotoRedirect";
import updatePhoto from "@/app/api/_actions/updatePhoto";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { IPhoto } from "models";
import { useRouter } from "next/navigation";

/** PhotoDialog to be used for intercepted photo routes */
function PhotoDialog({ photo }: { photo: IPhoto }) {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  const actionHandler = async (prev: any, data: any) => {
    // redirect client side since intercepts can't handle server side redirects
    const res = await updatePhoto(prev, data);
    console.warn("redirecting to", getPhotoRedirect(photo.photoable!, photo));
    router.replace(getPhotoRedirect(photo.photoable!, photo));
    return res;
  };
  return (
    <Dialog open={true} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Photo '{photo.title}'</DialogTitle>
      <DialogContent>
        <Stack>
          <UpdatePhotoForm photo={photo} action={actionHandler as any} />
          <PhotoImageListItem photo={photo} hideTitle />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default PhotoDialog;
