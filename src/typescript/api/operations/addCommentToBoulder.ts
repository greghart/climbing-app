import { getCustomRepository } from 'typeorm';

import Comment from '../../models/Comment';
import User from '../../models/User';
import Boulder from '../../models/Boulder';
import CommentRepository from '../../models/repositories/CommentRepository';

const addCommentToBoulder = (boulder: Boulder, text: string, user: User) => {
  const commentRepository = getCustomRepository(CommentRepository);
  const comment = new Comment();
  comment.text = text;
  comment.user = user;
  return commentRepository.commentOn(boulder, comment);
};

export default addCommentToBoulder;
