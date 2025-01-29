import 'timestamps.dart';
import 'topo.dart';
import 'types.dart';
import 'upload.dart';

class Photo {
  final int id;
  final String title;
  final String? description;
  final Upload? upload;
  final Timestamps timestamps;
  final Topo? topo;

  const Photo({
    required this.id,
    required this.title,
    this.description,
    this.upload,
    required this.timestamps,
    this.topo,
  });

  factory Photo.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'title': String title,
          'description': String? description,
          'upload': JsonObject upload,
          'topo': JsonObject? topo,
        }) {
      return Photo(
        id: id,
        title: title,
        description: description,
        upload: Upload.fromJson(upload),
        timestamps: Timestamps.fromJson(json),
        topo: topo != null ? Topo.fromJson(topo) : null,
      );
    }
    throw JSONException("Photo", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'upload': upload?.toJson(),
      ...timestamps.toJson(),
    };
  }
}
