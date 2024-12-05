import useActionState from "@/app/_components/form/useActionState";
import deletePhoto from "@/app/api/_actions/deletePhoto";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { IPhoto } from "models";

/**
 * A no JS solution to click and delete a photo
 */
export default function PhotoDeleteButton({ photo }: { photo: IPhoto }) {
  const [state, formAction, meta] = useActionState(deletePhoto, {
    ok: true,
    data: null,
    meta: { id: photo.id },
  });
  return (
    <form action={formAction}>
      <IconButton aria-label={`remove ${photo.title}`} type="submit">
        <Delete />
      </IconButton>
    </form>
  );
}
