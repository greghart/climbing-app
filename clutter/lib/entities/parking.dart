import 'index.dart';
import 'types.dart';

class Parking {
  final int id;
  final String? name;
  final String description;
  final LatLng location;

  Parking({
    required this.id,
    this.name,
    required this.description,
    required this.location,
  });

  factory Parking.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'name': String name,
          'description': String description,
          'location': JsonObject location,
        }) {
      LatLng c = jsonLatLng(location);

      return Parking(
        id: id,
        name: name == "" ? null : name,
        description: description,
        location: c,
      );
    }
    throw JSONException("Parking", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'location': location.toJson(),
    };
  }
}
