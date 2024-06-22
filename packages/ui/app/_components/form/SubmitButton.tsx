import { Button } from "@mui/material";
import React from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton(
  props: React.ComponentProps<typeof Button>
) {
  const { pending } = useFormStatus();
  return (
    <Button
      color="success"
      variant="outlined"
      type="submit"
      {...props}
      disabled={pending}
    >
      {props.children || "Save"}
    </Button>
  );
}
