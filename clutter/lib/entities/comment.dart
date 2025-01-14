import 'timestamps.dart';
import 'types.dart';

class Comment {
  final int id;
  final String text;
  final Timestamps timestamps;

  const Comment({
    required this.id,
    required this.text,
    required this.timestamps,
  });

  factory Comment.fromJson(JsonObject json) {
    if (json case {'id': int id, 'text': String text}) {
      return Comment(
        id: id,
        text: text,
        timestamps: Timestamps.fromJson(json),
      );
    }
    throw JSONException("Comment", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'text': text,
      ...timestamps.toJson(),
    };
  }
}
