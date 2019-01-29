import * as React from 'react';
import { Omit } from 'utility-types';
import { Link } from 'react-router-dom';
import CommentModel from '../../../models/Comment';
import Comment from './Comment';

interface Props {
  // A path to creating a new comment for this entity
  newRoute: string;
  comments: (Omit<CommentModel, 'commentable'>)[]
}

const ShowComments: React.SFC<Props> = (props) => {
  return (
    <div>
      <ul className="list-group list-group-flush">
        {props.comments.length === 0 && (
          <li className="list-group-item">
            No comments yet. Be the first one!
          </li>
        )}
        <li className="list-group-item">
          <Link
            to={props.newRoute}
            className="btn btn-primary">
            Add Comment
          </Link>
        </li>
        {props.comments.map((thisComment) => {
          return (
            <Comment key={thisComment.id} comment={thisComment} user={thisComment.user}/>
          );
        })}
      </ul>
    </div>
  )
};

ShowComments.defaultProps = {
  comments: [
    {
      id: 1,
      text: 'Wow, what a great route this was',
      user: {
        id: 1,
        email: 'greghartemail@gmail.com',
        name: 'Greg Hart',
        comments: []
      },
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      id: 2,
      text: 'It really really was',
      user: {
        id: 1,
        email: 'greghartemail@gmail.com',
        name: 'Greg Hart',
        comments: []
      },
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  ]
}

export default ShowComments;
