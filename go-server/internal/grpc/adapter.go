package grpc

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Crag
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
		Comments:    CommentableToProto(m.Commentable),
		Photos:      PhotoableToProto(m.Photoable),
		Trail:       TrailToProto(m.Trail),
		Timestamps:  TimestampsToProto(m.Timestamps),
	}
}

// ProtoToCrag converts a *pb.Crag to a *models.Crag
func ProtoToCrag(p *pb.Crag) *models.Crag {
	if p == nil {
		return nil
	}
	return &models.Crag{
		ID:          p.GetId(),
		Name:        p.GetName(),
		Description: stringPtr(p.GetDescription()),
		Bounds:      ProtoToBounds(p.GetBounds()),
		Center:      ProtoToCoordinate(p.GetCenter()),
		DefaultZoom: int(p.GetDefaultZoom()),
		MinZoom:     intPtr(p.GetMinZoom()),
		MaxZoom:     intPtr(p.GetMaxZoom()),
		Parking:     ProtoToParking(p.GetParking()),
		Areas:       ProtoToAreas(p.GetAreas()),
		Commentable: ProtoToCommentable(p.GetComments()),
		Photoable:   ProtoToPhotoable(p.GetPhotos()),
		Trail:       ProtoToTrail(p.GetTrail()),
		Timestamps:  ProtoToTimestamps(p.GetTimestamps()),
	}
}

// Bounds
func BoundsToProto(m *models.Bounds) *pb.Bounds {
	if m == nil {
		return nil
	}
	return &pb.Bounds{
		TopLeft:     CoordinateToProto(&m.TopLeft),
		BottomRight: CoordinateToProto(&m.BottomRight),
	}
}

// ProtoToBounds converts a *pb.Bounds to a *models.Bounds
func ProtoToBounds(p *pb.Bounds) *models.Bounds {
	if p == nil {
		return nil
	}
	return &models.Bounds{
		TopLeft:     ProtoToCoordinate(p.GetTopLeft()),
		BottomRight: ProtoToCoordinate(p.GetBottomRight()),
	}
}

// Coordinate
func CoordinateToProto(m *models.Coordinate) *pb.Coordinate {
	if m == nil {
		return nil
	}
	return &pb.Coordinate{
		Lat: m.Lat,
		Lng: m.Lng,
	}
}

// ProtoToCoordinate converts a *pb.Coordinate to a models.Coordinate
func ProtoToCoordinate(p *pb.Coordinate) models.Coordinate {
	if p == nil {
		return models.Coordinate{}
	}
	return models.Coordinate{
		Lat: p.Lat,
		Lng: p.Lng,
	}
}

// Parking
func ParkingToProto(m *models.Parking) *pb.Parking {
	if m == nil {
		return nil
	}
	return &pb.Parking{
		Id:          m.ID,
		Name:        derefString(m.Name),
		Description: derefString(m.Description),
		Location:    CoordinateToProto(&m.Location),
		CragId:      m.CragID,
	}
}

// ProtoToParking converts a *pb.Parking to a *models.Parking
func ProtoToParking(p *pb.Parking) *models.Parking {
	if p == nil {
		return nil
	}
	return &models.Parking{
		ID:          p.GetId(),
		CragID:      p.GetCragId(),
		Name:        stringPtr(p.GetName()),
		Description: stringPtr(p.GetDescription()),
		Location:    ProtoToCoordinate(p.GetLocation()),
	}
}

// Area
func AreaToProto(m *models.Area) *pb.Area {
	if m == nil {
		return nil
	}
	return &pb.Area{
		Id:          m.ID,
		Name:        m.Name,
		Description: derefString(m.Description),
		Polygon:     PolygonToProto(m.Polygon),
		Boulders:    BouldersToProto(m.Boulders),
		Comments:    CommentableToProto(m.Commentable),
		Photos:      PhotoableToProto(m.Photoable),
	}
}

// ProtoToArea converts a *pb.Area to a *models.Area
func ProtoToArea(p *pb.Area) *models.Area {
	if p == nil {
		return nil
	}
	return &models.Area{
		ID:          p.GetId(),
		Name:        p.GetName(),
		Description: stringPtr(p.GetDescription()),
		Polygon:     ProtoToPolygon(p.GetPolygon()),
		Boulders:    ProtoToBoulders(p.GetBoulders()),
		Commentable: ProtoToCommentable(p.GetComments()),
		Photoable:   ProtoToPhotoable(p.GetPhotos()),
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

// ProtoToAreas converts a slice of *pb.Area to a slice of models.Area
func ProtoToAreas(pbAreas []*pb.Area) []models.Area {
	result := make([]models.Area, 0, len(pbAreas))
	for _, p := range pbAreas {
		if p != nil {
			result = append(result, *ProtoToArea(p))
		}
	}
	return result
}

// Polygon
func PolygonToProto(m *models.Polygon) *pb.Polygon {
	if m == nil {
		return nil
	}
	return &pb.Polygon{
		Id:          m.ID,
		Descriptor_: derefString(m.Descriptor),
		Coordinates: PolygonCoordinatesToProto(m.Coordinates),
	}
}

// ProtoToPolygon converts a *pb.Polygon to a *models.Polygon
func ProtoToPolygon(p *pb.Polygon) *models.Polygon {
	if p == nil {
		return nil
	}
	return &models.Polygon{
		ID:          p.GetId(),
		Descriptor:  stringPtr(p.GetDescriptor_()),
		Coordinates: ProtoToPolygonCoordinates(p.GetCoordinates()),
	}
}

// Note PolygonCoordinate <-> Proto is not 1:1
func PolygonCoordinatesToProto(coords []models.PolygonCoordinate) []*pb.Coordinate {
	result := make([]*pb.Coordinate, 0, len(coords))
	for i := range coords {
		result = append(result, CoordinateToProto(&coords[i].Coordinate))
	}
	return result
}

// Note PolygonCoordinate <-> Proto is not 1:1
func ProtoToPolygonCoordinates(pbCoords []*pb.Coordinate) []models.PolygonCoordinate {
	result := make([]models.PolygonCoordinate, 0, len(pbCoords))
	for i, c := range pbCoords {
		if c != nil {
			result = append(result, models.PolygonCoordinate{
				Order:      i,
				Coordinate: ProtoToCoordinate(c),
			})
		}
	}
	return result
}

// Boulder
func BoulderToProto(m *models.Boulder) *pb.Boulder {
	if m == nil {
		return nil
	}
	return &pb.Boulder{
		Id:          m.ID,
		Name:        m.Name,
		Description: derefString(m.Description),
		Coordinates: CoordinateToProto(&m.Coordinates),
		AreaId:      m.AreaID,
		Routes:      RoutesToProto(m.Routes),
		Polygon:     PolygonToProto(m.Polygon),
		Comments:    CommentableToProto(m.Commentable),
		Photos:      PhotoableToProto(m.Photoable),
	}
}

// ProtoToBoulder converts a *pb.Boulder to a *models.Boulder
func ProtoToBoulder(p *pb.Boulder) *models.Boulder {
	if p == nil {
		return nil
	}
	return &models.Boulder{
		ID:          p.GetId(),
		Name:        p.GetName(),
		Description: stringPtr(p.GetDescription()),
		Coordinates: ProtoToCoordinate(p.GetCoordinates()),
		AreaID:      p.GetAreaId(),
		Routes:      ProtoToRoutes(p.GetRoutes()),
		Polygon:     ProtoToPolygon(p.GetPolygon()),
		Commentable: ProtoToCommentable(p.GetComments()),
		Photoable:   ProtoToPhotoable(p.GetPhotos()),
	}
}

// BouldersToProto converts a slice of models.Boulder to a slice of *pb.Boulder
func BouldersToProto(boulders []models.Boulder) []*pb.Boulder {
	result := make([]*pb.Boulder, 0, len(boulders))
	for i := range boulders {
		result = append(result, BoulderToProto(&boulders[i]))
	}
	return result
}

// ProtoToBoulders converts a slice of *pb.Boulder to a slice of models.Boulder
func ProtoToBoulders(pbBoulders []*pb.Boulder) []models.Boulder {
	result := make([]models.Boulder, 0, len(pbBoulders))
	for _, p := range pbBoulders {
		if p != nil {
			result = append(result, *ProtoToBoulder(p))
		}
	}
	return result
}

// Route
func RouteToProto(m *models.Route) *pb.Route {
	if m == nil {
		return nil
	}
	return &pb.Route{
		Id:          m.ID,
		Name:        m.Name,
		Description: derefString(m.Description),
		FirstAscent: derefString(m.FirstAscent),
		BoulderId:   m.BoulderID,
		Grade:       GradeToProto(m.Grade),
		// TODO: Size is omitted as models.Route does not have a Size field yet
	}
}

// ProtoToRoute converts a *pb.Route to a *models.Route
func ProtoToRoute(p *pb.Route) *models.Route {
	if p == nil {
		return nil
	}
	return &models.Route{
		ID:          p.GetId(),
		Name:        p.GetName(),
		Description: stringPtr(p.GetDescription()),
		FirstAscent: stringPtr(p.GetFirstAscent()),
		Grade:       ProtoToGrade(p.GetGrade()),
		BoulderID:   p.GetBoulderId(),
		// Note: Size field is omitted as models.Route does not have it
	}
}

// RoutesToProto converts a slice of models.Route to a slice of *pb.Route
func RoutesToProto(routes []models.Route) []*pb.Route {
	result := make([]*pb.Route, 0, len(routes))
	for i := range routes {
		result = append(result, RouteToProto(&routes[i]))
	}
	return result
}

// ProtoToRoutes converts a slice of *pb.Route to a slice of models.Route
func ProtoToRoutes(pbRoutes []*pb.Route) []models.Route {
	result := make([]models.Route, 0, len(pbRoutes))
	for _, p := range pbRoutes {
		if p != nil {
			result = append(result, *ProtoToRoute(p))
		}
	}
	return result
}

// Grade
func GradeToProto(m *models.Grade) *pb.Grade {
	if m == nil {
		return nil
	}
	var system pb.Grade_GradingSystem
	switch m.System {
	case "V_SCALE":
		system = pb.Grade_GRADING_SYSTEM_V_SCALE
	case "YDS":
		system = pb.Grade_GRADING_SYSTEM_YDS
	default:
		system = pb.Grade_GRADING_SYSTEM_UNSPECIFIED
	}
	return &pb.Grade{
		Raw:    m.Raw,
		System: system,
		Value:  m.Value,
	}
}

// ProtoToGrade converts a *pb.Grade to a *models.Grade
func ProtoToGrade(p *pb.Grade) *models.Grade {
	if p == nil {
		return nil
	}
	var system models.GradingSystem
	switch p.GetSystem() {
	case pb.Grade_GRADING_SYSTEM_V_SCALE:
		system = "V_SCALE"
	case pb.Grade_GRADING_SYSTEM_YDS:
		system = "YDS"
	default:
		system = ""
	}
	return &models.Grade{
		Raw:    p.GetRaw(),
		System: system,
		Value:  p.GetValue(),
	}
}

// Commentable
func CommentableToProto(m *models.Commentable) []*pb.Comment {
	if m == nil {
		return nil
	}
	results := make([]*pb.Comment, len(m.Comments))
	for i := range m.Comments {
		results[i] = CommentToProto(&m.Comments[i])
	}
	return results
}

// ProtoToCommentable converts []*pb.Comment to a *models.Commentable.
// Note that we don't surface commentable metadata to clients as it's considered an implementation
// detail.
func ProtoToCommentable(p []*pb.Comment) *models.Commentable {
	if p == nil {
		return nil
	}
	return &models.Commentable{
		ID:         0,
		Descriptor: "unknown",
		Comments:   ProtoToComments(p),
	}
}

// Comment
func CommentToProto(m *models.Comment) *pb.Comment {
	if m == nil {
		return nil
	}
	return &pb.Comment{
		Id:         m.ID,
		Text:       m.Text,
		Timestamps: TimestampsToProto(m.Timestamps),
	}
}

// ProtoToComment converts a *pb.Comment to a *models.Comment
func ProtoToComment(p *pb.Comment) *models.Comment {
	if p == nil {
		return nil
	}
	return &models.Comment{
		ID:         p.GetId(),
		Text:       p.GetText(),
		Timestamps: ProtoToTimestamps(p.GetTimestamps()),
	}
}

// ProtoToComments converts a slice of *pb.Comment to a slice of models.Comment
func ProtoToComments(pbComments []*pb.Comment) []models.Comment {
	result := make([]models.Comment, 0, len(pbComments))
	for _, p := range pbComments {
		if p != nil {
			result = append(result, *ProtoToComment(p))
		}
	}
	return result
}

// Timestamps
func TimestampsToProto(t models.Timestamps) *pb.Timestamps {
	return &pb.Timestamps{
		CreatedAt: timestamppb.New(t.CreatedAt),
		UpdatedAt: timestamppb.New(t.UpdatedAt),
	}
}

// ProtoToTimestamps converts a *pb.Timestamps to a models.Timestamps.
// Note that Timestamps are never nullable in our system.
func ProtoToTimestamps(p *pb.Timestamps) models.Timestamps {
	if p == nil {
		return models.Timestamps{}
	}
	return models.Timestamps{
		CreatedAt: p.GetCreatedAt().AsTime(),
		UpdatedAt: p.GetUpdatedAt().AsTime(),
	}
}

// Photoable
func PhotoableToProto(m *models.Photoable) []*pb.Photo {
	if m == nil {
		return nil
	}
	results := make([]*pb.Photo, len(m.Photos))
	for i := range m.Photos {
		results[i] = PhotoToProto(&m.Photos[i])
	}
	return results
}

// ProtoToPhotoable converts []*pb.Photoable to a *models.Photoable
// Note that we don't surface photoable metadata to clients as it's considered an implementation
// detail.
func ProtoToPhotoable(p []*pb.Photo) *models.Photoable {
	if p == nil {
		return nil
	}
	return &models.Photoable{
		ID:         0,
		Descriptor: "unknown",
		Photos:     ProtoToPhotos(p),
	}
}

// Photo
func PhotoToProto(m *models.Photo) *pb.Photo {
	return &pb.Photo{
		Id:          int64(m.ID),
		Title:       m.Title,
		Description: derefString(m.Description),
		Upload:      UploadToProto(m.Upload),
		Timestamps:  TimestampsToProto(m.Timestamps),
	}
}

// ProtoToPhoto converts a *pb.Photo to a *models.Photo
func ProtoToPhoto(p *pb.Photo) *models.Photo {
	if p == nil {
		return nil
	}
	return &models.Photo{
		ID:          p.GetId(),
		Title:       p.GetTitle(),
		Description: stringPtr(p.GetDescription()),
		Upload:      ProtoToUpload(p.GetUpload()),
		Timestamps:  ProtoToTimestamps(p.GetTimestamps()),
	}
}

// ProtoToPhotos converts a slice of *pb.Photo to a slice of models.Photo
func ProtoToPhotos(pbPhotos []*pb.Photo) []models.Photo {
	result := make([]models.Photo, 0, len(pbPhotos))
	for _, p := range pbPhotos {
		if p != nil {
			result = append(result, *ProtoToPhoto(p))
		}
	}
	return result
}

// Upload
func UploadToProto(m *models.Upload) *pb.Upload {
	if m == nil {
		return nil
	}
	return &pb.Upload{
		Id:           int64(m.ID),
		Key:          m.Key,
		Directory:    m.Directory,
		Engine:       m.Engine,
		OriginalName: m.OriginalName,
		FileSize:     int64(m.FileSize),
		Sha1Hash:     m.Sha1Hash,
		UploadedAt:   timestamppb.New(m.UploadedAt),
	}
}

// ProtoToUpload converts a *pb.Upload to a *models.Upload
func ProtoToUpload(p *pb.Upload) *models.Upload {
	if p == nil {
		return nil
	}
	return &models.Upload{
		ID:           p.GetId(),
		Key:          p.GetKey(),
		Directory:    p.GetDirectory(),
		Engine:       p.GetEngine(),
		OriginalName: p.GetOriginalName(),
		FileSize:     int(p.GetFileSize()),
		Sha1Hash:     p.GetSha1Hash(),
		UploadedAt:   p.GetUploadedAt().AsTime(),
	}
}

// Trail
func TrailToProto(m *models.Trail) *pb.Trail {
	if m == nil {
		return nil
	}
	return &pb.Trail{
		Id:     m.ID,
		CragId: m.CragID,
		Lines:  LinesToProto(m.Lines),
	}
}

// ProtoToTrail converts a *pb.Trail to a *models.Trail
func ProtoToTrail(p *pb.Trail) *models.Trail {
	if p == nil {
		return nil
	}
	return &models.Trail{
		ID:    p.Id,
		Lines: ProtoToLines(p.Lines),
	}
}

// Line
func LineToProto(m *models.Line) *pb.Line {
	if m == nil {
		return nil
	}
	return &pb.Line{
		Id:    m.ID,
		Start: CoordinateToProto(&m.Start),
		End:   CoordinateToProto(&m.End),
	}
}

// ProtoToLine converts a *pb.Line to a *models.Line
func ProtoToLine(p *pb.Line) *models.Line {
	if p == nil {
		return nil
	}
	return &models.Line{
		ID:    p.Id,
		Start: ProtoToCoordinate(p.Start),
		End:   ProtoToCoordinate(p.End),
	}
}

func LinesToProto(lines []models.Line) []*pb.Line {
	result := make([]*pb.Line, 0, len(lines))
	for i := range lines {
		result = append(result, LineToProto(&lines[i]))
	}
	return result
}

func ProtoToLines(pbLines []*pb.Line) []models.Line {
	result := make([]models.Line, 0, len(pbLines))
	for _, p := range pbLines {
		if p != nil {
			result = append(result, *ProtoToLine(p))
		}
	}
	return result
}

////////////////////////////////////////////////////////////////////////////////

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

func intPtr(i int32) *int {
	tmp := int(i)
	return &tmp
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
