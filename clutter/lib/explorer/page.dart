import 'package:flutter/material.dart';
import './layout.dart';
import './map.dart';
import './overlay.dart';

class ExplorerPage extends StatelessWidget {
  const ExplorerPage({
    super.key,
    required this.mapChildren,
    required this.buildOverlay,
  });

  final List<Widget> mapChildren;
  final Widget Function(
      ScrollController scrollController, bool isOnDesktopAndWeb)? buildOverlay;

  @override
  Widget build(BuildContext context) {
    return ExplorerLayout(
      map: MyMap(
        key: LabeledGlobalKey("map"),
        children: mapChildren,
      ),
      // TODO: Make this oepn the search page once I figure out routing
      search: const SearchBar(
        constraints:
            BoxConstraints(minWidth: 360.0, maxWidth: 480.0, minHeight: 36.0),
      ),
      overlay: OverlaySheet(
        build: buildOverlay,
      ),
    );
  }
}
