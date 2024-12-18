import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/area.dart';
import '../state.dart';
import 'layout.dart';

class AreaOverlay extends StatelessWidget {
  const AreaOverlay({
    super.key,
    required this.area,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final Area area;
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: area.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(bottom: 8, top: 8),
            child: Text(
              area.description!,
              style: theme.textTheme.bodyMedium,
            ),
          ),
          Text(
            "Boulders",
            style: theme.textTheme.headlineSmall,
          ),
          Expanded(
            child: ListView.builder(
              controller: isOnDesktopAndWeb ? null : scrollController,
              itemCount: area.boulders.length,
              itemBuilder: (BuildContext context, int index) {
                return ListTile(
                  onTap: () {
                    Provider.of<ExplorerState>(context, listen: false)
                        .setBoulder(area.boulders[index].id);
                  },
                  trailing: const Icon(Icons.navigate_next),
                  title: Text(
                    'Boulder ${area.boulders[index].name}',
                    style: theme.textTheme.bodyMedium,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
