import 'photo.dart';
import 'types.dart';

class Upload {
  final int id;
  final String key;
  final String directory;
  final String engine;
  final String originalName;
  final int fileSize;
  final String sha1Hash;
  final DateTime uploadedAt;
  final Photo? photo;

  const Upload({
    required this.id,
    required this.key,
    required this.directory,
    required this.engine,
    required this.originalName,
    required this.fileSize,
    required this.sha1Hash,
    required this.uploadedAt,
    this.photo,
  });

  factory Upload.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'key': String key,
          'directory': String directory,
          'engine': String engine,
          'originalName': String originalName,
          'fileSize': int fileSize,
          'sha1Hash': String sha1Hash,
          'uploadedAt': String uploadedAt,
        }) {
      return Upload(
        id: id,
        key: key,
        directory: directory,
        engine: engine,
        originalName: originalName,
        fileSize: fileSize,
        sha1Hash: sha1Hash,
        uploadedAt: DateTime.parse(uploadedAt),
      );
    }
    throw JSONException("Upload", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'key': key,
      'directory': directory,
      'engine': engine,
      'originalName': originalName,
      'fileSize': fileSize,
      'sha1Hash': sha1Hash,
      'uploadedAt': uploadedAt.toIso8601String(),
      'photo': photo?.toJson(),
    };
  }
}
