import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/boulder.dart';
import '../state.dart';
import 'layout.dart';

class BoulderOverlay extends StatelessWidget {
  const BoulderOverlay({
    super.key,
    required this.boulder,
  });
  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: boulder.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (boulder.description != null) ...[
            Container(
              padding: const EdgeInsets.only(bottom: 8, top: 8),
              child: Text(
                boulder.description!,
                style: theme.textTheme.bodyMedium,
              ),
            ),
          ],
          Text(
            "Routes",
            style: theme.textTheme.headlineSmall,
          ),
          for (final route in boulder.routes)
            ListTile(
              onTap: () {
                Provider.of<ExplorerState>(context, listen: false)
                    .setRoute(route.id);
              },
              trailing: const Icon(Icons.navigate_next),
              title: Text(
                'Route ${route.name}',
                style: theme.textTheme.bodyMedium,
              ),
            )
        ],
      ),
    );
  }
}
