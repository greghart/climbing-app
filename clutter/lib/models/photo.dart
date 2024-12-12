import 'timestamps.dart';
import 'types.dart';
import 'upload.dart';

class Photo {
  final int id;
  final String title;
  final String? description;
  final Upload? upload;
  final Timestamps timestamps;

  const Photo({
    required this.id,
    required this.title,
    this.description,
    this.upload,
    required this.timestamps,
  });

  factory Photo.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'title': String title,
          'description': String? description,
          'upload': JsonObject upload,
        }) {
      return Photo(
        id: id,
        title: title,
        description: description,
        upload: Upload.fromJson(upload),
        timestamps: Timestamps.fromJson(json),
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
