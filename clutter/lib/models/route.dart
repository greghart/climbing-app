import 'coordinate.dart';
import 'grade.dart';
import 'types.dart';

class Route {
  final int id;
  final int boulderId;
  final String name;
  final int? length; // in feet
  final String? description;
  final String? firstAscent;
  final Grade grade;
  final Coordinate? coordinates;

  const Route({
    required this.id,
    required this.boulderId,
    required this.name,
    this.length,
    this.description,
    this.firstAscent,
    required this.grade,
    this.coordinates,
  });

  factory Route.fromJson(int boulderId, JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'length': int? length,
          'description': String? description,
          'firstAscent': String? firstAscent,
          'grade': JsonObject grade,
          'coordinates': JsonObject? coordinates,
        }) {
      return Route(
        id: id,
        boulderId: boulderId,
        name: name,
        length: length,
        description: description,
        firstAscent: firstAscent,
        grade: Grade.fromJson(grade),
        coordinates:
            coordinates != null ? Coordinate.fromJson(coordinates) : null,
      );
    }
    throw JSONException("Route", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'name': name,
      'length': length,
      'description': description,
      'firstAscent': firstAscent,
      'grade': grade.toJson(),
      'coordinates': coordinates?.toJson(),
    };
  }
}
