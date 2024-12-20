import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/area.dart';
import '../state.dart';
import 'layout.dart';

class AreaOverlay extends StatelessWidget {
  const AreaOverlay({
    super.key,
    required this.area,
  });
  final Area area;

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
          for (final boulder in area.boulders)
            ListTile(
              onTap: () {
                Provider.of<ExplorerState>(context, listen: false)
                    .setBoulder(boulder.id);
              },
              trailing: const Icon(Icons.navigate_next),
              title: Text(
                'Boulder ${boulder.name}',
                style: theme.textTheme.bodyMedium,
              ),
            )
        ],
      ),
    );
  }
}
