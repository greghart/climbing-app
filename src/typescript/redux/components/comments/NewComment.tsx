import * as React from 'react';
import { InjectedFormProps, FormErrors } from 'redux-form';
import Comment from './Comment';
import User from '../../../models/User';
import CommentModel from '../../../models/Comment';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';

interface Props {
  user: User;
  // Hook into meta enter submit
  handleCustomSubmit: (e: any) => any;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

// The mapping from redux-form to FormData is not strictly safe
// That is, we can't know <Fields> will be setup
// @todo Setup runtime boundary validation here?
interface FormData {
  text?: string;
}

const NewComment: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <Comment
      comment={new CommentModel()}
      body={
        <form className="p-0">
          {props.error &&
            <span className="text-danger">{props.error}</span>
          }
          <MyField
            name="text"
            inputComponent="textarea"
            rows={3}
            onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && e.metaKey) {
                props.handleCustomSubmit(e);
              }
            }}
            help={<span>Press Meta+Enter to save</span>}
          />
        </form>
      }
      user={props.user}
    />
  );
};

NewComment.defaultProps = {
  user: {
    id: 1,
    email: 'greghartnewcomment',
    name: 'Greg',
    comments: [],
  },
};

export default NewComment;
export { FormData, Props };
