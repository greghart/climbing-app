import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/boulder.dart';
import '../state.dart';
import 'layout.dart';

class BoulderOverlay extends StatelessWidget {
  const BoulderOverlay({
    super.key,
    required this.boulder,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final Boulder boulder;
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: boulder.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (boulder.description != null) ...[
            Flexible(
              child: Container(
                padding: const EdgeInsets.only(bottom: 8, top: 8),
                child: Text(
                  boulder.description!,
                  style: theme.textTheme.bodyMedium,
                ),
              ),
            ),
          ],
          Flexible(
            child: Text(
              "Routes",
              style: theme.textTheme.headlineSmall,
            ),
          ),
          Flexible(
            child: ListView.builder(
              controller: isOnDesktopAndWeb ? null : scrollController,
              itemCount: boulder.routes.length,
              itemBuilder: (BuildContext context, int index) {
                return ListTile(
                  onTap: () {
                    Provider.of<ExplorerState>(context, listen: false)
                        .setRoute(boulder.routes[index].id);
                  },
                  trailing: const Icon(Icons.navigate_next),
                  title: Text(
                    'Route ${boulder.routes[index].name}',
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
