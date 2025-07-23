package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

var CommentableIncludeSchema = servicep.NewIncludeSchema().Allow("comments")

type CommentableReadRequest struct {
	ID      int64
	Include *servicep.IncludeRequest
}

////////////////////////////////////////////////////////////////////////////////

type CommentableRepository struct {
	*sqlp.Repository[models.Commentable]
	queryTemplate *queryp.Template
	getMapper     func() mapperp.Mapper[commentableRow, models.Commentable]
}

func NewCommentableRepository(db *sqlp.DB) *CommentableRepository {
	return &CommentableRepository{
		Repository: sqlp.NewRepository[models.Commentable](db, "commentable"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
					   SELECT c.id, c.descriptor
					   {{- if .Include "comments"}},
					   cm.id AS comment_id, 
						 cm.text AS comment_text, 
						 cm.commentableId AS commentable_id, 
						 cm.createdAt AS comment_created_at, 
						 cm.updatedAt AS comment_updated_at
					   {{- end}}
					   FROM commentable c
					   {{- if .Include "comments"}}
					   LEFT JOIN comment cm ON cm.commentableId = c.id
					   {{- end}}
					   WHERE c.id = :id
					   {{- if .Include "comments"}}
					   ORDER BY cm.createdAt ASC
					   {{- end}}
			   `)),
		getMapper: func() mapperp.Mapper[commentableRow, models.Commentable] {
			return mapperp.InnerSlice(
				func(e *models.Commentable) *[]models.Comment { return &e.Comments },
				func(e *models.Comment) int64 { return e.ID },
				func(row *commentableRow) *models.Comment { return &row.Comment },
			)
		},
	}
}

// GetCommentable fetches a commentable by ID, optionally including comments via LEFT JOIN.
func (r *CommentableRepository) GetCommentable(ctx context.Context, req CommentableReadRequest) (*models.Commentable, error) {
	t := r.queryTemplate.Param("id", req.ID)
	if req.Include != nil {
		for inc := range req.Include.All() {
			t = t.Include(inc)
		}
	}
	q, args, err := t.Execute()
	if err != nil {
		return nil, err
	}

	rows, err := sqlp.Query[commentableRow](ctx, r.Repository.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var commentable models.Commentable
	mapper := mapperp.One(
		func(row *commentableRow) *models.Commentable { return &row.Commentable },
		r.getMapper(),
	)
	for rows.Next() {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, err
		}
		mapper(&commentable, &row)
	}
	if commentable.ID == 0 { // No commentable found
		return nil, nil
	}
	return &commentable, nil
}

type commentableRow struct {
	models.Commentable
	Comment models.Comment `sqlp:"comment"`
}
