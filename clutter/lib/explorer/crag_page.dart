import 'package:flutter/material.dart';

import 'crag_map.dart';
import 'crag_overlay.dart';
import 'page.dart';

class CragPage extends StatelessWidget {
  const CragPage({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ExplorerPage(
      mapChildren: const [CragMap()],
      buildOverlay:
          (ScrollController scrollController, bool isOnDesktopAndWeb) {
        return CragOverlay(
          scrollController: scrollController,
          isOnDesktopAndWeb: isOnDesktopAndWeb,
        );
      },
    );
  }
}
