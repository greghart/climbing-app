import 'coordinate.dart';
import 'polygon.dart';
import 'route.dart';
import 'types.dart';

class Boulder {
  final int id;
  final String name;
  final String? description;
  final Coordinate coordinates;
  final List<Route> routes;
  final Polygon? polygon;

  const Boulder({
    required this.id,
    required this.name,
    required this.coordinates,
    required this.routes,
    this.description,
    this.polygon,
  });

  factory Boulder.fromJson(JsonObject json) {
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
        name: name,
        description: description,
        coordinates: Coordinate.fromJson(coordinates),
        routes: routes.map((route) => Route.fromJson(route)).toList(),
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
