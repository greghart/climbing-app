"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import createComment from "@/app/api/_actions/createComment";
import { Stack } from "@mui/material";
import { ICommentable } from "models";

interface Props {
  commentable: ICommentable;
  text: string;
  redirect: string;
  action: typeof createComment;
}

export default function CommentForm(props: Props) {
  const [state, formAction, meta] = useFormState(props.action, {
    ok: true,
    data: {
      text: props.text,
    },
    meta: {
      commentable_id: props.commentable.id!,
    },
  });
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField state={state} name="text" />
        <SubmitButton />
      </Stack>
    </form>
  );
}
