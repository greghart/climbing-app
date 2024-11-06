"use client";
import { ListItem, ListItemText, Slide } from "@mui/material";
import { IComment } from "models";
import { useSearchParams } from "next/navigation";

function CommentListItem(props: { comment: IComment }) {
  const params = useSearchParams();
  const item = (
    <ListItem>
      <ListItemText
        primary={props.comment.text}
        secondary={`Saved at ${props.comment.updatedAt}`}
      />
    </ListItem>
  );
  if (params.get("highlight") === props.comment.id!.toString()) {
    return (
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        {item}
      </Slide>
    );
  }
  return item;
}

export default CommentListItem;
