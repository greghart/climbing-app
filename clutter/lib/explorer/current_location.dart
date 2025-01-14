import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:provider/provider.dart';

import '../entities/crag.dart';
import 'model.dart';

/// A widget that displays the current location of the user on a map.
/// For now it simulates the streams
class CurrentLocation extends StatelessWidget {
  const CurrentLocation({
    super.key,
    required this.crag,
  });
  final Crag crag;

  @override
  build(BuildContext context) {
    // Just uses streams so don't need to listen
    final locations =
        Provider.of<ExplorerLocationModel>(context, listen: false);
    return CallbackShortcuts(
      bindings: <ShortcutActivator, VoidCallback>{
        const SingleActivator(LogicalKeyboardKey.keyQ): () {
          locations.rotateLeft();
        },
        const SingleActivator(LogicalKeyboardKey.keyE): () {
          locations.rotateRight();
        },
        const SingleActivator(LogicalKeyboardKey.keyW): () {
          locations.up();
        },
        const SingleActivator(LogicalKeyboardKey.keyS): () {
          locations.down();
        },
        const SingleActivator(LogicalKeyboardKey.keyA): () {
          locations.left();
        },
        const SingleActivator(LogicalKeyboardKey.keyD): () {
          locations.right();
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
