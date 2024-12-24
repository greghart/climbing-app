import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../models/crag.dart';
import '../model.dart';

class TrailsLayer extends StatelessWidget {
  const TrailsLayer({
    super.key,
    required this.crag,
  });

  final Crag crag;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final layers = Provider.of<ExplorerLayersModel>(context);
    if (!layers.isChecked(LayerType.trails)) return const SizedBox.shrink();

    return PolylineLayer<Object>(
      simplificationTolerance: 0.3,
      polylines: (crag.trail?.toPolylines ?? []).map((points) {
        return Polyline(
          points: points,
          color: theme.colorScheme.secondary,
          strokeWidth: 4.0,
        );
      }).toList(),
    );
  }
}
