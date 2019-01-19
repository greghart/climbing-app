import * as React from 'react';
import { Omit } from 'utility-types';
import Route from '../../../models/Route';
import Comment from '../../../models/Comment';
import User from '../../../models/User';
import ProfileIcon from '../users/ProfileIcon';

interface Props {
  myRoute: Route;
  comments: (Omit<Comment, 'commentable'>)[]
}

const RouteComments: React.SFC<Props> = (props) => {
  return (
    <div>
      <ul className="list-group list-group-flush">
        {props.comments.length === 0 && (
          <li className="list-group-item">
            No comments yet. Be the first one!
          </li>
        )}
        {props.comments.map((thisComment) => {
          return (
            <li className="list-group-item" key={thisComment.id}>
              <div className="row">
                <div className="col-auto">
                  <ProfileIcon user={thisComment.user} />
                </div>
                <div className="col">
                  <p>
                    {thisComment.text}
                  </p>
                  <small>Posted {thisComment.timestamps.createdAt}</small>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )
};

RouteComments.defaultProps = {
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

export default RouteComments;
