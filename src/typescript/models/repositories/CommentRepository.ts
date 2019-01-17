import { EntityRepository, Repository } from "typeorm";
import Route from "../Route";
import Comment from "../Comment";
import Commentable from "../Commentable";

/**
 * A custom comment repository repository to help us abstract away the
 * polymorphic associations
 */
@EntityRepository(Comment)
export default class CommentRepository extends Repository<Comment> {

  async commentOnRoute(route: Route, comment: Comment) {
    let commentable = await route.commentable;
    // Build the commentable if we need to
    if (!commentable) {
      commentable = new Commentable();
      commentable.descriptor = `route-${route.id}`;
      await this.manager.save(commentable);
      route.commentable = Promise.resolve(commentable);
      await this.manager.save(route);
    }
    comment.commentable = commentable;
    await this.manager.save(comment);
  }

}
