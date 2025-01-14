import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../util/sun.dart';

/// Polyline with a little arrow head at the top
class Arrow extends StatelessWidget {
  const Arrow({
    super.key,
    required this.base,
    required this.to,
    this.color = Colors.yellow,
    this.angle = 45,
    this.size = .2,
  });

  final LatLng base;
  final LatLng to;
  final double angle;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final Vector2 baseVector = (
      base.latitude - to.latitude,
      base.longitude - to.longitude,
    );
    // First make a unit vector
    final baseMagnitude = magnitude(baseVector);
    final unitVector = (
      baseVector.$1 / baseMagnitude,
      baseVector.$2 / baseMagnitude,
    );
    // Now make two vectors -- each at a 45 degree angle from the unit vector
    final vectorA = rotate(unitVector, angle);
    final vectorB = rotate(unitVector, -angle);

    return PolylineLayer<Object>(
      simplificationTolerance: 0,
      polylines: [
        Polyline(
          points: [
            to,
            LatLng(
              to.latitude + vectorA.$1 * baseMagnitude * size,
              to.longitude + vectorA.$2 * baseMagnitude * size,
            ),
          ],
          color: color,
          strokeWidth: 4.0,
        ),
        Polyline(
          points: [
            to,
            LatLng(
              to.latitude + vectorB.$1 * baseMagnitude * size,
              to.longitude + vectorB.$2 * baseMagnitude * size,
            ),
          ],
          color: color,
          strokeWidth: 4.0,
        ),
        Polyline(
          points: [base, to],
          color: color,
          strokeWidth: 4.0,
        ),
      ],
    );
  }
}
