import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../../models/area.dart';
import '../state.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class AreaMap extends StatelessWidget {
  const AreaMap({super.key, required this.area});

  final Area area;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Stack(
      children: [
        if (area.polygon != null) ...[
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: area.polygon!.toLatLngs,
              ),
            ],
          )
        ],
        MarkerLayer(
          markers: area.boulders.map((b) {
            return Marker(
              width: 30,
              height: 30,
              point: b.coordinates.toLatLng,
              child: IconButton(
                iconSize: 30,
                onPressed: () =>
                    Provider.of<ExplorerState>(context, listen: false)
                        .setBoulder(b.id),
                icon: Image.asset(
                  'assets/images/boulder_icon.svg.png',
                  width: 30,
                  height: 30,
                  opacity: const AlwaysStoppedAnimation(0.8),
                ),
              ),
            );
          }).toList(),
        ),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: LatLng(
            area.polygon!.coordinates.map((c) => c.lat).average,
            area.polygon!.coordinates.map((c) => c.lng).average,
          ),
          zoom: 19,
        ),
      ],
    );
  }
}
