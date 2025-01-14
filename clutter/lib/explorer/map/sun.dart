import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../../util/sun.dart';
import '../../util/suncalc.dart' as suncalc;
import '../model.dart';
import 'arrow.dart';

const _sunRayOffset = 2 / 1000; // km
const _sunRayMaxLength =
    16 / 1000; // max length at solar noon (basically never happens), km

class SunLayer extends StatelessWidget {
  const SunLayer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final layers = Provider.of<ExplorerLayersModel>(context);
    if (!layers.isChecked(LayerType.sun)) return const SizedBox.shrink();

    final model = Provider.of<ExplorerModel>(context);
    LatLng coordinate;
    switch (model.entityType) {
      case EntityType.area:
        coordinate = model.area!.center;
      case EntityType.boulder:
        coordinate = model.boulder!.coordinates;
      case EntityType.route:
        coordinate = model.route!.coordinates ?? model.boulder!.coordinates;
      default:
        coordinate = model.crag.center;
    }

    final sunPosition = suncalc.getPosition(
      time: DateTime.now(),
      lat: coordinate.latitude,
      lng: coordinate.longitude,
    );
    // Suncalc gives azimuth based on 0 degrees at the unit vector (0, -1) (ie. south)
    final Vector2 unitVector = (
      math.cos(suncalc.toRadians(sunPosition.azimuth) + math.pi),
      math.sin(suncalc.toRadians(sunPosition.azimuth) + math.pi),
    );
    // Direct sun ray at a point a couple meters off target
    final to = offsetBy(
      coordinate,
      unitVector.$1 * _sunRayOffset,
      unitVector.$2 * _sunRayOffset,
    );
    final size = math.max(
      _sunRayMaxLength * (sunPosition.altitude / 90),
      4 / 1000,
    );
    return Stack(children: [
      Arrow(
        base: offsetBy(
          to,
          unitVector.$1 * _sunRayMaxLength,
          unitVector.$2 * _sunRayMaxLength,
        ),
        to: to,
        color: Colors.yellow.withValues(alpha: 0.2),
      ),
      Arrow(
        base: offsetBy(
          to,
          unitVector.$1 * size,
          unitVector.$2 * size,
        ),
        to: to,
      ),
    ]);
  }
}
