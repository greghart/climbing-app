"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import UploadField from "@/app/_components/form/UploadField";
import useActionState from "@/app/_components/form/useActionState";
import createPhoto from "@/app/api/_actions/createPhoto";
import { FormHelperText, Stack } from "@mui/material";
import { IPhoto, IPhotoable } from "models";
import React from "react";

interface Props {
  photoable: IPhotoable;
  photo?: IPhoto;
  action: typeof createPhoto;
}

export default function CreatePhotoForm(props: Props) {
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
  const [pendingFileName, setPendingFileName] = React.useState<string | null>(
    null
  );
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField state={state} name="title" />
        <TextField state={state} name="description" />
        <UploadField
          state={state}
          name="upload"
          id="photo-upload"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={(e) => {
            // NOTE: Pending file name or preview could bein UploadField, but re-rendering component loses upload context
            const f = (e.target.files || [])[0];
            if (f) {
              setPendingFileName(f.name);
            } else {
              setPendingFileName(null);
            }
            return true;
          }}
        >
          Upload Photo
        </UploadField>
        {pendingFileName && (
          <FormHelperText>Uploading {pendingFileName}...</FormHelperText>
        )}
        <SubmitButton />
      </Stack>
    </form>
  );
}
