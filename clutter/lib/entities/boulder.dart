import 'difficulty_breakdown.dart';
import 'index.dart';
import 'types.dart';

class Boulder {
  final int id;
  final int areaId;
  final String name;
  final String? description;
  final LatLng coordinates;
  final List<Route> routes;
  final Polygon? polygon;
  final DifficultyBreakdown difficultyBreakdown;
  final List<Photo> photos;

  Boulder({
    required this.id,
    required this.areaId,
    required this.name,
    required this.coordinates,
    required this.routes,
    required this.photos,
    this.description,
    this.polygon,
  }) : difficultyBreakdown = DifficultyBreakdown(routes);

  factory Boulder.fromJson(int areaId, JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String? description,
          'coordinates': JsonObject coordinates,
          'routes': List routes,
          'photos': List photos,
        }) {
      Polygon? polygon;
      if (json case {'polygon': JsonObject polygonJson}) {
        polygon = Polygon.fromJson(polygonJson);
      }
      LatLng c = jsonLatLng(coordinates);

      return Boulder(
        id: id,
        areaId: areaId,
        name: name,
        description: description,
        coordinates: c,
        routes: routes.map((route) => Route.fromJson(id, c, route)).toList(),
        polygon: polygon,
        photos: photos.map((photo) => Photo.fromJson(photo)).toList(),
      );
    }
    throw JSONException("Boulder", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'coordinates': coordinates.toJson(),
      'routes': routes.map((route) => route.toJson()).toList(),
      'polygon': polygon?.toJson(),
    };
  }
}
