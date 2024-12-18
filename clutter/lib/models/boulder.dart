import 'coordinate.dart';
import 'polygon.dart';
import 'route.dart';
import 'types.dart';

class Boulder {
  final int id;
  final int areaId;
  final String name;
  final String? description;
  final Coordinate coordinates;
  final List<Route> routes;
  final Polygon? polygon;

  const Boulder({
    required this.id,
    required this.areaId,
    required this.name,
    required this.coordinates,
    required this.routes,
    this.description,
    this.polygon,
  });

  factory Boulder.fromJson(int areaId, JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String? description,
          'coordinates': JsonObject coordinates,
          'routes': List routes,
          'polygon': JsonObject? polygon,
        }) {
      return Boulder(
        id: id,
        areaId: areaId,
        name: name,
        description: description,
        coordinates: Coordinate.fromJson(coordinates),
        routes: routes.map((route) => Route.fromJson(id, route)).toList(),
        polygon: polygon != null ? Polygon.fromJson(polygon) : null,
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
