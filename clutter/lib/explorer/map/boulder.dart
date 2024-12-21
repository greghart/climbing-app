import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';

import '../../models/boulder.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class BoulderMap extends StatelessWidget {
  const BoulderMap({super.key, required this.boulder});

  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Stack(
      children: [
        if (boulder.polygon != null) ...[
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: boulder.polygon!.coordinates,
              ),
            ],
          )
        ],
        MarkerLayer(
          // TODO: Clustering around boulder
          markers: boulder.routes.where((r) => r.coordinates != null).map((r) {
            return Marker(
              point: r.coordinates!,
              height: 20,
              width: 20,
              child: Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: theme.colorScheme.secondary,
                  shape: BoxShape.circle,
                ),
              ),
            );
          }).toList(),
        ),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: boulder.coordinates,
          zoom: 21,
        ),
      ],
    );
  }
}
