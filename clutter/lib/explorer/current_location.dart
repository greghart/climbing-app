import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';
import 'model.dart';

/// A widget that displays the current location of the user on a map.
/// For now it simulates the streams
class CurrentLocation extends StatefulWidget {
  const CurrentLocation({
    super.key,
    required this.crag,
  });
  final Crag crag;

  @override
  State<CurrentLocation> createState() => _CurrentLocationState();
}

class _CurrentLocationState extends State<CurrentLocation> {
  double _currentLat = 0;
  double _currentLng = 0;
  double _heading = 0;

  @override
  void initState() {
    super.initState();
    final location = Provider.of<ExplorerLocationModel>(context, listen: false);
    setLatLng(location.positionStream, widget.crag.center.latitude,
        widget.crag.center.longitude);
    setHeading(location.headingStream, 0);
  }

  void setLatLng(StreamController<LocationMarkerPosition?> stream, double lat,
      double lng) {
    _currentLat = lat;
    _currentLng = lng;
    stream.add(
      LocationMarkerPosition(
        latitude: _currentLat,
        longitude: _currentLng,
        accuracy: 0,
      ),
    );
  }

  void setHeading(
      StreamController<LocationMarkerHeading?> stream, double heading) {
    _heading = heading;
    stream.add(LocationMarkerHeading(heading: _heading, accuracy: pi * 0.2));
  }

  @override
  build(BuildContext context) {
    final locations = Provider.of<ExplorerLocationModel>(context);
    return CallbackShortcuts(
      bindings: <ShortcutActivator, VoidCallback>{
        const SingleActivator(LogicalKeyboardKey.keyQ): () {
          setHeading(locations.headingStream, _heading - pi / 8);
        },
        const SingleActivator(LogicalKeyboardKey.keyE): () {
          setHeading(locations.headingStream, _heading + pi / 8);
        },
        const SingleActivator(LogicalKeyboardKey.keyW): () {
          setLatLng(
            locations.positionStream,
            _currentLat + 0.0001,
            _currentLng,
          );
        },
        const SingleActivator(LogicalKeyboardKey.keyS): () {
          setLatLng(
            locations.positionStream,
            _currentLat - 0.0001,
            _currentLng,
          );
        },
        const SingleActivator(LogicalKeyboardKey.keyA): () {
          setLatLng(
            locations.positionStream,
            _currentLat,
            _currentLng - 0.0001,
          );
        },
        const SingleActivator(LogicalKeyboardKey.keyD): () {
          setLatLng(
            locations.positionStream,
            _currentLat,
            _currentLng + 0.0001,
          );
        },
      },
      child: Focus(
        autofocus: true,
        child: CurrentLocationLayer(
          positionStream: locations.positionStream.stream,
          headingStream: locations.headingStream.stream,
        ),
      ),
    );
  }
}
