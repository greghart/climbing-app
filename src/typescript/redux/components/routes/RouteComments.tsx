import * as React from 'react';
import { Omit } from 'utility-types';
import Route from '../../../models/Route';
import Comment from '../../../models/Comment';
import User from '../../../models/User';
import ProfileIcon from '../users/ProfileIcon';

interface Props {
  myRoute: Route;
  comments: (Omit<Comment, 'user' | 'commentable'> & { user: Omit<User, 'comments'> })[];
}

const RouteComments: React.SFC<Props> = (props) => {
  console.warn(props, 'RouteComments');
  return (
    <div>
      <ul className="list-group list-group-flush">
        {props.comments.map((thisComment) => {
          return (
            <li className="list-group-item" key={thisComment.id}>
              <div className="row">
                <div className="col-auto">
                  <ProfileIcon user={thisComment.user} />
                </div>
                <div className="col">
                  {thisComment.text}
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
        name: 'Greg Hart'
      }
    },
    {
      id: 2,
      text: 'It really really was',
      user: {
        id: 1,
        email: 'greghartemail@gmail.com',
        name: 'Greg Hart'
      }
    }
  ]
}

export default RouteComments;
