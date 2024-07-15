import { AddComment } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IComment, ICommentable } from "models";
import Link from "next/link";

interface Props {
  // A path to creating a new comment for this entity
  newRoute: string;
  commentable: ICommentable;
}

function ShowComments(props: Props) {
  const comments = props.commentable.comments || [];
  return (
    <List>
      {comments.length === 0 && (
        <ListItem>
          <ListItemText primary="No comments yet. Be the first one!" />
        </ListItem>
      )}
      {comments.map((thisComment) => {
        return <Comment key={thisComment.id} comment={thisComment} />;
      })}
      <Link href="comments/new">
        <ListItemButton>
          <ListItemIcon>
            <AddComment />
          </ListItemIcon>
          <ListItemText primary="Add Comment" />
        </ListItemButton>
      </Link>
    </List>
  );
}

function Comment(props: { comment: IComment }) {
  return (
    <ListItem>
      <ListItemText
        primary={props.comment.text}
        secondary={`Saved at ${props.comment.updatedAt}`}
      />
    </ListItem>
  );
}

export default ShowComments;
