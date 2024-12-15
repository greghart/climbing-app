import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/link.dart';

import '../models/area.dart';

class AreaOverlay extends StatelessWidget {
  const AreaOverlay({
    super.key,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    final area = context.watch<Area>();
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // TODO: Breadcrumbs for navigation

        Row(
          children: [
            Link(
              uri: Uri.parse('/explorer'),
              builder: (BuildContext context, FollowLink? followLink) =>
                  TextButton(
                onPressed: followLink,
                child: const Icon(Icons.arrow_back),
              ),
            ),
            Center(
              child: Text(
                area.name,
                style: theme.textTheme.displaySmall!,
              ),
            ),
          ],
        ),
        const Divider(),
        Text(
          "Boulders",
          style: theme.textTheme.headlineSmall,
        ),
        Flexible(
          child: ListView.builder(
            controller: isOnDesktopAndWeb ? null : scrollController,
            itemCount: area.boulders.length,
            itemBuilder: (BuildContext context, int index) {
              return ListTile(
                onTap: () {},
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
    );
  }
}
