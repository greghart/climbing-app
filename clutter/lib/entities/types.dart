// Per jsonDecode type
typedef JsonObject = Map<String, dynamic>;

class JSONException extends FormatException {
  const JSONException(String type, dynamic given)
      : super('Unexpected $type JSON format: $given');
}
