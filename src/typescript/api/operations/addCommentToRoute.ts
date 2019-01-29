import { getCustomRepository } from 'typeorm';

import Comment from '../../models/Comment';
import User from '../../models/User';
import Route from '../../models/Route';
import CommentRepository from '../../models/repositories/CommentRepository';

const addCommentToRoute = (route: Route, text: string, user: User) => {
  const commentRepository = getCustomRepository(CommentRepository);
  const comment = new Comment();
  comment.text = text;
  comment.user = user;
  return commentRepository.commentOn(route, comment);
};

export default addCommentToRoute;
