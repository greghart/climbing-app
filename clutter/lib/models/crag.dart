import 'area.dart';
import 'bounds.dart';
import 'coordinate.dart';
import 'trail.dart';
import 'types.dart';

class Crag {
  final int id;
  final String name;
  final String? description;
  final Bounds bounds;
  final Coordinate center;
  final int defaultZoom;
  final int minZoom;
  final int maxZoom;
  final List<Area> areas;
  final Trail? trail;

  const Crag({
    required this.id,
    required this.name,
    this.description,
    required this.bounds,
    required this.center,
    required this.defaultZoom,
    required this.minZoom,
    required this.maxZoom,
    required this.areas,
    this.trail,
  });

  factory Crag.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String? description,
          'bounds': JsonObject bounds,
          'center': JsonObject center,
          'defaultZoom': int defaultZoom,
          'minZoom': int minZoom,
          'maxZoom': int maxZoom,
          'areas': List<dynamic> areas,
          'trail': JsonObject? trail,
        }) {
      return Crag(
        id: id,
        name: name,
        description: description,
        bounds: Bounds.fromJson(bounds),
        center: Coordinate.fromJson(center),
        defaultZoom: defaultZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        areas: areas.map((area) => Area.fromJson(area)).toList(),
        trail: trail != null ? Trail.fromJson(trail) : null,
      );
    }
    throw JSONException("Crag", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'bounds': bounds.toJson(),
      'center': center.toJson(),
      'defaultZoom': defaultZoom,
      'minZoom': minZoom,
      'maxZoom': maxZoom,
      'areas': areas.map((area) => area.toJson()).toList(),
      'trail': trail?.toJson(),
    };
  }
}
