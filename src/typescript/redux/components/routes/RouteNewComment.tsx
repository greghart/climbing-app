import * as React from 'react';
import { Omit } from 'utility-types';
import { Field, InjectedFormProps } from 'redux-form';
import Comment from './Comment';
import User from '../../../models/User';
import CommentModel from '../../../models/Comment';

interface Props {
  user: User;
  // Hook into meta enter submit
  handleCustomSubmit: (e: any) => any;
}

const RouteNewComment: React.SFC<InjectedFormProps<{ text: string }> & Props> = (props) => {
  return (
    <Comment
      comment={new CommentModel()}
      body={
        <form onSubmit={props.handleSubmit}>
          <div className="form-group">
            <Field
              name="text"
              component="textarea"
              className="form-control"
              rows={3}
              onKeyPress={(e) => {
                if (e.key == 'Enter' && e.metaKey) {
                  props.handleCustomSubmit(e);
                }
              }}
            />
            <small id="emailHelp" className="form-text text-muted">
              Press Meta+Enter to save
            </small>
          </div>
        </form>
      }
      user={props.user}
    />
  )
};

RouteNewComment.defaultProps = {
  user: {
    id: 1,
    email: 'greghartnewcomment',
    name: "Greg",
    comments: []
  }
}

export default RouteNewComment;

