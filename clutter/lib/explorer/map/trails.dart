import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../entities/crag.dart';
import '../model.dart';
import 'color_scheme.dart';

class TrailsLayer extends StatelessWidget {
  const TrailsLayer({
    super.key,
    required this.crag,
  });

  final Crag crag;

  @override
  Widget build(BuildContext context) {
    final layers = Provider.of<ExplorerLayersModel>(context);
    if (!layers.isChecked(LayerType.trails)) return const SizedBox.shrink();

    return PolylineLayer<Object>(
      simplificationTolerance: 0.3,
      polylines: (crag.trail?.toPolylines ?? []).map((points) {
        return Polyline(
            points: points,
            color: colorScheme.onPrimary,
            strokeWidth: 4.0,
            pattern: StrokePattern.dashed(segments: const [5, 10]));
      }).toList(),
    );
  }
}
