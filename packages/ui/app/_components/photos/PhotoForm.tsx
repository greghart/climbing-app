"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import createPhoto from "@/app/api/_actions/createPhoto";
import { Stack } from "@mui/material";
import { IPhoto, IPhotoable } from "models";

interface Props {
  photoable: IPhotoable;
  photo?: IPhoto;
  action: typeof createPhoto;
}

export default function PhotoForm(props: Props) {
  const [state, formAction, meta] = useActionState(props.action, {
    ok: true,
    data: props.photo || {
      title: "",
      description: "",
    },
    meta: {
      photoable_id: props.photoable.id!,
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
