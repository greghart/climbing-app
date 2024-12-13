import 'package:clutter/data.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

class CragMap extends StatelessWidget {
  const CragMap({super.key});

  @override
  Widget build(BuildContext context) {
    final data = context.watch<Data>();
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    return PolygonLayer(
      polygons: data.crag.areas.where((a) => a.polygon != null).map((a) {
        return Polygon(
          points: a.polygon!.toLatLngs,
          color: null,
          borderStrokeWidth: 4.0,
          borderColor: colorScheme.secondary,
        );
      }).toList(),
    );
  }
}
