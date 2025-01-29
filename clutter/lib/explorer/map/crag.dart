import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../entities/crag.dart';
import '../model.dart';
import 'animate_to.dart';
import 'area.dart';
import 'color_scheme.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class CragMap extends StatefulWidget {
  const CragMap({super.key});

  @override
  State<CragMap> createState() => _CragMapState();
}

class _CragMapState extends State<CragMap> {
  final LayerHitNotifier<HitValue> _hitNotifier = ValueNotifier(null);
  List<HitValue>? _prevHitValues;
  List<Polygon<HitValue>>? _hoverGons;

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    final theme = Theme.of(context);
    final polygonsById = Map.fromEntries(
      crag.areas.where((a) => a.polygon != null).map((a) {
        return MapEntry(
          a.id,
          MyPolygon(
            theme: theme,
            points: a.polygon!.coordinates,
            label: a.name,
            hitValue: (id: a.id),
          ),
        );
      }),
    );
    final layers = Provider.of<ExplorerLayersModel>(context);

    return MouseRegion(
      hitTestBehavior: HitTestBehavior.deferToChild,
      cursor: SystemMouseCursors.click,
      onHover: (_) {
        final hitValues = _hitNotifier.value?.hitValues.toList();
        if (hitValues == null) return;

        if (listEquals(hitValues, _prevHitValues)) return;
        _prevHitValues = hitValues;

        final hoverLines = hitValues.map((v) {
          final original = polygonsById[v.id]!;

          return Polygon<HitValue>(
            points: original.points,
            color: null,
            borderStrokeWidth: 6.0,
            borderColor: colorScheme.outlineVariant,
          );
        }).toList();
        setState(() => _hoverGons = hoverLines);
      },
      onExit: (_) {
        _prevHitValues = null;
        setState(() => _hoverGons = null);
      },
      child: GestureDetector(
        // We shouldn't really have overlapping areas, just navigate to first area
        onTap: () => context
            .read<ExplorerModel>()
            .setArea(_hitNotifier.value!.hitValues.first.id),
        child: Stack(
          children: [
            if (layers.isChecked(LayerType.boulders))
              BouldersLayer(
                boulders: crag.areas.expand((a) => a.boulders).toList(),
              ),
            if (layers.isChecked(LayerType.areas))
              PolygonLayer(
                hitNotifier: _hitNotifier,
                simplificationTolerance: 0,
                polygons: [
                  ...polygonsById.values,
                  ...?_hoverGons,
                ],
              ),
            AnimateTo(
              mapController: MapController.of(context),
              latLng: crag.center,
              zoom: crag.defaultZoom.toDouble(),
              offset: Offset.zero,
            ),
          ].whereType<Widget>().toList(),
        ),
      ),
    );
  }
}
