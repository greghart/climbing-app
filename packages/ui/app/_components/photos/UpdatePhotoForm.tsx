"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import updatePhoto from "@/app/api/_actions/updatePhoto";
import { Stack } from "@mui/material";
import { IPhoto } from "models";

interface Props {
  photo: IPhoto;
  action: typeof updatePhoto;
}

/**
 * @todo We could refactor for more re-use with CreatePhotoForm, but not worth it for now
 * @param props
 * @returns
 */
export default function UpdatePhotoForm(props: Props) {
  const [state, formAction, meta] = useActionState(props.action, {
    ok: true,
    data: props.photo,
    meta: {
      id: props.photo.id!,
    },
  });
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField state={state} name="title" />
        <TextField state={state} name="description" />
        <SubmitButton />
      </Stack>
    </form>
  );
}
