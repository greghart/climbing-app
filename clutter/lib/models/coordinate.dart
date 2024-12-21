import 'package:latlong2/latlong.dart';
import 'types.dart';

export 'package:latlong2/latlong.dart';

/// Rather than having two data structures, just immediately parse climbing-app
/// Coordinate objects to flutter_map LatLng objects
LatLng jsonLatLng(JsonObject json) {
  if (json case {'lat': double lat, 'lng': double lng}) {
    return LatLng(lat, lng);
  }
  throw JSONException("LatLng", json);
}
