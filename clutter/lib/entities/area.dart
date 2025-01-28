import 'package:latlong2/latlong.dart';

import 'boulder.dart';
import 'difficulty_breakdown.dart';
import 'photo.dart';
import 'polygon.dart';
import 'types.dart';

class Area {
  final int id;
  final String name;
  final String? description;
  final Polygon? polygon;
  final List<Boulder> boulders;
  final DifficultyBreakdown difficultyBreakdown;
  final List<Photo> photos;

  Area({
    required this.id,
    required this.name,
    required this.boulders,
    required this.photos,
    this.description,
    this.polygon,
  }) : difficultyBreakdown = DifficultyBreakdown(boulders
            .map(
              (b) => b.routes,
            )
            .expand((r) => r)
            .toList());

  factory Area.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String? description,
          'polygon': JsonObject? polygon,
          'boulders': List boulders,
          'photos': List photos,
        }) {
      return Area(
        id: id,
        name: name,
        description: description,
        polygon: polygon != null ? Polygon.fromJson(polygon) : null,
        boulders:
            boulders.map((boulder) => Boulder.fromJson(id, boulder)).toList(),
        photos: photos.map((photo) => Photo.fromJson(photo)).toList(),
      );
    }
    throw JSONException('Area', json);
  }
  LatLng get center => polygon!.center;

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
