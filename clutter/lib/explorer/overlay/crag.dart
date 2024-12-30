import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/crag.dart';
import '../model.dart';
import 'layout.dart';

class CragOverlay extends StatelessWidget {
  const CragOverlay({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    final theme = Theme.of(context);

    return OverlayLayout(
      title: crag.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(bottom: 8, top: 8),
            child: Text(
              crag.description!,
              style: theme.textTheme.bodyMedium,
            ),
          ),
          Text(
            "Areas",
            style: theme.textTheme.headlineSmall,
          ),
          for (final area in crag.areas)
            ListTile(
              onTap: () {
                Provider.of<ExplorerModel>(context, listen: false)
                    .setArea(area.id);
              },
              trailing: const Icon(Icons.navigate_next),
              title: Text(
                area.name,
                style: theme.textTheme.bodyMedium,
              ),
            )
        ],
      ),
    );
  }
}
