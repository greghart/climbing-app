import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model.dart';

class OverlayLayout extends StatelessWidget {
  const OverlayLayout({
    super.key,
    required this.title,
    required this.child,
    this.breadcrumbs,
  });
  final String title;
  final Widget child;

  /// Leave a trail of breadcrumbs up the path
  final List<Widget>? breadcrumbs;

  @override
  Widget build(BuildContext context) {
    return SliverMainAxisGroup(
      slivers: [
        SliverToBoxAdapter(child: Breadcrumbs(title: title)),
        const SliverToBoxAdapter(child: Divider()),
        SliverToBoxAdapter(child: child),
      ],
    );
  }
}

/// TODO: This is a persistent header delegate for breadcrumbs so that it can be pinned if user scrolls through
/// lots of areas, boulders, routes. Unfortunately, breadcrumbs can overflow, and this delegate needs static heights,
/// so there's work to get it working properly
class BreadcrumbsDelegate extends SliverPersistentHeaderDelegate {
  const BreadcrumbsDelegate({required this.title});

  final String title;

  @override
  get minExtent => 32;
  @override
  get maxExtent => 32;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Breadcrumbs(title: title);
  }

  @override
  bool shouldRebuild(SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}

class Breadcrumbs extends StatelessWidget {
  const Breadcrumbs({super.key, required this.title});

  final String title;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final model = context.watch<ExplorerModel>();

    return Container(
      color: theme.colorScheme.surfaceBright,
      child: Wrap(
        spacing: 8,
        children: [
          if (model.area != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () {
                Provider.of<ExplorerModel>(context, listen: false).setCrag();
              },
              child: Text(model.crag.name),
            ),
            divider(theme),
          ],
          if (model.boulder != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () {
                Provider.of<ExplorerModel>(context, listen: false)
                    .setArea(model.area!.id);
              },
              child: Text(model.area!.name),
            ),
            divider(theme),
          ],
          if (model.route != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () {
                Provider.of<ExplorerModel>(context, listen: false)
                    .setBoulder(model.boulder!.id);
              },
              child: Text(model.boulder!.name),
            ),
            divider(theme),
          ],
          Text(
            title,
            style: theme.textTheme.headlineSmall!,
          ),
        ].whereType<Widget>().toList(),
      ),
    );
  }

  Widget divider(ThemeData theme) {
    return Text(" / ", style: theme.textTheme.headlineSmall!);
  }
}
