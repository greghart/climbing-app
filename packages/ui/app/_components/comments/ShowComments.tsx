import CommentListItem from "@/app/_components/comments/CommentListItem";
import { AddComment } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ICommentable } from "models";
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
        return <CommentListItem key={thisComment.id} comment={thisComment} />;
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

export default ShowComments;
