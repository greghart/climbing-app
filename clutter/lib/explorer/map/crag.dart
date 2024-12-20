import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../models/crag.dart';
import '../state.dart';
import 'animate_to.dart';
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
            points: a.polygon!.toLatLngs,
            label: a.name,
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
          Provider.of<ExplorerState>(context, listen: false)
              .setArea(_hitNotifier.value!.hitValues.first.id);
          // context
          //     .go('/explorer/areas/${_hitNotifier.value!.hitValues.first.id}');
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
        child: Stack(
          children: [
            PolygonLayer(
              hitNotifier: _hitNotifier,
              simplificationTolerance: 0,
              polygons: [
                ...polygonsById.values,
                ...?_hoverGons,
              ],
            ),
            PolylineLayer<Object>(
              simplificationTolerance: 0.3,
              polylines: crag.trail?.toPolylines ?? [],
            ),
            AnimateTo(
              mapController: MapController.of(context),
              latLng: crag.center.toLatLng,
              zoom: crag.defaultZoom.toDouble(),
              offset: Offset.zero,
            ),
          ],
        ),
      ),
    );
  }
}
