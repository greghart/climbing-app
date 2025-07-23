package service

// Comments is the service level comments handler
// This is service should abstract a way the "commentable" single table inheritance implementation,
// and let users work directly with comments and the types they want comments for.
type Comments struct {
	*Services
}

func NewComments(services *Services) *Comments {
	return &Comments{
		Services: services,
	}
}
