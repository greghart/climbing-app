import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';

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
          Polygon(
            points: a.polygon!.toLatLngs,
            pattern: const StrokePattern.dotted(spacingFactor: 2),
            color: theme.colorScheme.secondaryContainer.withOpacity(0.5),
            borderStrokeWidth: 4.0,
            borderColor: theme.colorScheme.secondary,
            labelPlacement: PolygonLabelPlacement.polylabel,
            label: a.name,
            labelStyle: theme.textTheme.bodyMedium!
                .copyWith(color: theme.colorScheme.onSecondaryContainer),
            hitValue: (id: a.id),
          ),
        );
      }),
    );

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
            borderColor: theme.colorScheme.secondary,
          );
        }).toList();
        setState(() => _hoverGons = hoverLines);
      },
      onExit: (_) {
        _prevHitValues = null;
        setState(() => _hoverGons = null);
      },
      child: GestureDetector(
        onTap: () {
          // We shouldn't really have overlapping areas, just navigate to first area
          context
              .go('/explorer/areas/${_hitNotifier.value!.hitValues.first.id}');
        },
        // onLongPress: () => _openTouchedGonsModal(
        //   'Long pressed',
        //   _hitNotifier.value!.hitValues,
        //   _hitNotifier.value!.coordinate,
        // ),
        // onSecondaryTap: () => _openTouchedGonsModal(
        //   'Secondary tapped',
        //   _hitNotifier.value!.hitValues,
        //   _hitNotifier.value!.coordinate,
        // ),
        // child: PolygonLayer(
        //   hitNotifier: _hitNotifier,
        //   simplificationTolerance: 0,
        child: PolygonLayer(
          hitNotifier: _hitNotifier,
          simplificationTolerance: 0,
          polygons: [
            ...polygonsById.values,
            ...?_hoverGons,
          ],
        ),
      ),
    );
  }
}
