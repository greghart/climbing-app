import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';
import 'area_map.dart';
import 'area_overlay.dart';
import 'page.dart';

class AreaPage extends StatelessWidget {
  const AreaPage({
    super.key,
    required this.id,
  });

  final int id;

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    final area = crag.areas.where((a) => a.id == id).firstOrNull;
    if (area == null) {
      // TODO: Reusable error page and go back button
      return Text("Area $id not found");
    }
    return Provider(
      create: (context) => area,
      child: ExplorerPage(
        mapChildren: const [AreaMap()],
        buildOverlay:
            (ScrollController scrollController, bool isOnDesktopAndWeb) {
          return AreaOverlay(
            scrollController: scrollController,
            isOnDesktopAndWeb: isOnDesktopAndWeb,
          );
        },
      ),
    );
  }
}
