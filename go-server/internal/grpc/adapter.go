package grpc

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
)

// Adapters between our model layer and protobufs

// CragToProto converts a models.Crag to a pb.Crag
func CragToProto(m *models.Crag) *pb.Crag {
	if m == nil {
		return nil
	}
	return &pb.Crag{
		Id:          m.ID,
		Name:        m.Name,
		Description: derefString(m.Description),
		Bounds:      BoundsToProto(m.Bounds),
		Center:      CoordinateToProto(&m.Center),
		DefaultZoom: int32(m.DefaultZoom),
		MinZoom:     derefInt32(m.MinZoom),
		MaxZoom:     derefInt32(m.MaxZoom),
		Parking:     ParkingToProto(m.Parking),
		Areas:       AreasToProto(m.Areas),
		Commentable: CommentableToProto(m.Commentable),
		Photoable:   PhotoableToProto(m.Photoable),
		Trail:       TrailToProto(m.Trail),
	}
}

// Helper functions for pointer fields
func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func derefInt32(i *int) int32 {
	if i == nil {
		return 0
	}
	return int32(*i)
}

func derefInt64(i *int64) int64 {
	if i == nil {
		return 0
	}
	return *i
}

// BoundsToProto converts a *models.Bounds to a *pb.Bounds
func BoundsToProto(m *models.Bounds) *pb.Bounds {
	if m == nil {
		return nil
	}
	return &pb.Bounds{
		TopLeft:     CoordinateToProto(&m.TopLeft),
		BottomRight: CoordinateToProto(&m.BottomRight),
	}
}

// CoordinateToProto converts a *models.Coordinate to a *pb.Coordinate
func CoordinateToProto(m *models.Coordinate) *pb.Coordinate {
	if m == nil {
		return nil
	}
	return &pb.Coordinate{
		Lat: m.Lat,
		Lng: m.Lng,
	}
}

// ParkingToProto converts a *models.Parking to a *pb.Parking
func ParkingToProto(m *models.Parking) *pb.Parking {
	if m == nil {
		return nil
	}
	return &pb.Parking{
		Id:          derefInt64(m.ID),
		Name:        derefString(m.Name),
		Description: derefString(m.Description),
		Location:    CoordinateToProto(&m.Location),
	}
}

// AreasToProto converts a slice of models.Area to a slice of *pb.Area
func AreasToProto(areas []models.Area) []*pb.Area {
	result := make([]*pb.Area, 0, len(areas))
	for _, a := range areas {
		result = append(result, AreaToProto(&a))
	}
	return result
}

// AreaToProto converts a *models.Area to a *pb.Area
func AreaToProto(m *models.Area) *pb.Area {
	if m == nil {
		return nil
	}
	return &pb.Area{
		Id:          derefInt64(m.ID),
		Name:        m.Name,
		Description: derefString(m.Description),
		Polygon:     PolygonToProto(m.Polygon),
		Boulders:    BouldersToProto(m.Boulders),
		Commentable: CommentableToProto(m.Commentable),
		Photoable:   PhotoableToProto(m.Photoable),
	}
}

// PolygonToProto converts a *models.Polygon to a *pb.Polygon
func PolygonToProto(m *models.Polygon) *pb.Polygon {
	if m == nil {
		return nil
	}
	return &pb.Polygon{
		Id:          derefInt64(m.ID),
		Descriptor_: derefString(m.Descriptor),
		Coordinates: CoordinatesToProto(m.Coordinates),
	}
}

// CoordinatesToProto converts a slice of models.Coordinate to a slice of *pb.Coordinate
func CoordinatesToProto(coords []models.Coordinate) []*pb.Coordinate {
	result := make([]*pb.Coordinate, 0, len(coords))
	for i := range coords {
		result = append(result, CoordinateToProto(&coords[i]))
	}
	return result
}

// BouldersToProto converts a slice of models.Boulder to a slice of *pb.Boulder
func BouldersToProto(boulders []models.Boulder) []*pb.Boulder {
	result := make([]*pb.Boulder, 0, len(boulders))
	for i := range boulders {
		result = append(result, BoulderToProto(&boulders[i]))
	}
	return result
}

// BoulderToProto converts a *models.Boulder to a *pb.Boulder
func BoulderToProto(m *models.Boulder) *pb.Boulder {
	if m == nil {
		return nil
	}
	return &pb.Boulder{
		Id: derefInt64(m.ID),
		// Add more fields as needed
	}
}

// CommentableToProto converts a *models.Commentable to a *pb.Commentable
func CommentableToProto(m *models.Commentable) *pb.Commentable {
	if m == nil {
		return nil
	}
	return &pb.Commentable{
		Id:          derefInt64(m.ID),
		Descriptor_: m.Descriptor,
		Comments:    CommentsToProto(m.Comments),
	}
}

// CommentsToProto converts a slice of models.Comment to a slice of *pb.Comment
func CommentsToProto(comments []models.Comment) []*pb.Comment {
	result := make([]*pb.Comment, 0, len(comments))
	for i := range comments {
		result = append(result, CommentToProto(&comments[i]))
	}
	return result
}

// CommentToProto converts a *models.Comment to a *pb.Comment
func CommentToProto(m *models.Comment) *pb.Comment {
	if m == nil {
		return nil
	}
	return &pb.Comment{
		Id: derefInt64(m.ID),
		// Add more fields as needed
	}
}

// PhotoableToProto converts a *models.Photoable to a *pb.Photoable
func PhotoableToProto(m *models.Photoable) *pb.Photoable {
	if m == nil {
		return nil
	}
	return &pb.Photoable{
		Id:          derefInt64(m.ID),
		Descriptor_: m.Descriptor,
		// Add more fields as needed
	}
}

// TrailToProto converts a *models.Trail to a *pb.Trail
func TrailToProto(m *models.Trail) *pb.Trail {
	if m == nil {
		return nil
	}
	return &pb.Trail{
		Id:    derefInt64(m.ID),
		Lines: LinesToProto(m.Lines),
	}
}

// LinesToProto converts a slice of models.Line to a slice of *pb.Line
func LinesToProto(lines []models.Line) []*pb.Line {
	result := make([]*pb.Line, 0, len(lines))
	for i := range lines {
		result = append(result, LineToProto(&lines[i]))
	}
	return result
}

// LineToProto converts a *models.Line to a *pb.Line
func LineToProto(m *models.Line) *pb.Line {
	if m == nil {
		return nil
	}
	return &pb.Line{
		Id:    derefInt64(m.ID),
		Start: CoordinateToProto(&m.Start),
		End:   CoordinateToProto(&m.End),
	}
}
