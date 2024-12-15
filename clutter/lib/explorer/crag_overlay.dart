import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';

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

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            crag.name,
            style: theme.textTheme.displaySmall!,
          ),
        ),
        const Divider(),
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
                onTap: () {},
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
    );
  }
}
