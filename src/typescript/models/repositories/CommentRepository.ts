import { EntityRepository, Repository } from "typeorm";
import Route from "../Route";
import Comment from "../Comment";
import Commentable from "../Commentable";
import get = require("lodash/get");

/**
 * A custom comment repository repository to help us abstract away the
 * polymorphic associations
 */
@EntityRepository(Comment)
export default class CommentRepository extends Repository<Comment> {

  async commentOnRoute(route: Route, comment: Comment) {
    // Find an existing commentable, if any
    let commentable = route.commentable ?
      route.commentable :
      get(await
        this.manager.getRepository(Route)
        .createQueryBuilder('route')
        .innerJoinAndSelect('route.commentable', 'commentable')
        .getOne()
      , 'commentable');
    // Build the commentable if needed
    if (!commentable) {
      commentable = new Commentable();
      commentable.descriptor = `route-${route.id}`;
      await this.manager.save(commentable);
      route.commentable = commentable;
      await this.manager.save(route);
    }
    comment.commentable = commentable;
    await this.manager.save(comment);
  }

}
