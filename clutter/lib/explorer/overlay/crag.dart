import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/crag.dart';
import '../state.dart';
import 'layout.dart';

class CragOverlay extends StatelessWidget {
  const CragOverlay({
    super.key,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

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
          Flexible(
            child: ListView.builder(
              controller: isOnDesktopAndWeb ? null : scrollController,
              itemCount: crag.areas.length,
              itemBuilder: (BuildContext context, int index) {
                return ListTile(
                  onTap: () {
                    Provider.of<ExplorerState>(context, listen: false)
                        .setArea(crag.areas[index].id);
                  },
                  trailing: const Icon(Icons.navigate_next),
                  title: Text(
                    'Area ${crag.areas[index].name}',
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
