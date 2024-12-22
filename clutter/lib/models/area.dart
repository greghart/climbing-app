import 'boulder.dart';
import 'polygon.dart';
import 'types.dart';

class Area {
  final int id;
  final String name;
  final String? description;
  final Polygon? polygon;
  final List<Boulder> boulders;

  const Area({
    required this.id,
    required this.name,
    required this.boulders,
    this.description,
    this.polygon,
  });

  factory Area.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String? description,
          'polygon': JsonObject? polygon,
          'boulders': List boulders,
        }) {
      return Area(
        id: id,
        name: name,
        description: description,
        polygon: polygon != null ? Polygon.fromJson(polygon) : null,
        boulders:
            boulders.map((boulder) => Boulder.fromJson(id, boulder)).toList(),
      );
    }
    throw JSONException('Area', json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'polygon': polygon?.toJson(),
      'boulders': boulders.map((boulder) => boulder.toJson()).toList(),
    };
  }
}
