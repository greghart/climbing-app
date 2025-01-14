import '../util/sun.dart';
import 'coordinate.dart';
import 'difficulty_breakdown.dart';
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
  final LatLng? coordinates;
  // Which bucket does this route falls into
  final DifficultyBucket bucket;
  // The vector to the route from the boulder
  final Vector2? vector;

  Route({
    required this.id,
    required this.boulderId,
    required this.name,
    this.length,
    this.description,
    this.firstAscent,
    required this.grade,
    this.coordinates,
    this.vector,
  }) : bucket = getBucket(grade);

  factory Route.fromJson(
      int boulderId, LatLng boulderCoordinates, JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'length': int? length,
          'description': String? description,
          'firstAscent': String? firstAscent,
          'grade': JsonObject grade,
        }) {
      LatLng? ll;
      if (json case {'coordinates': JsonObject c}) {
        ll = jsonLatLng(c);
      }
      return Route(
        id: id,
        boulderId: boulderId,
        name: name,
        length: length,
        description: description,
        firstAscent: firstAscent,
        grade: Grade.fromJson(grade),
        coordinates: ll,
        // TODO: It'd be more accurate to find the normal of the route off the polygon instead of boulder "center"
        // Center works ok for round boulders, but not for any complexity.
        vector: ll == null
            ? null
            : (
                ll.latitude - boulderCoordinates.latitude,
                ll.longitude - boulderCoordinates.longitude,
              ),
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
