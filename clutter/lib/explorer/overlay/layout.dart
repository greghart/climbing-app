import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../settings/settings_controller.dart';
import '../model.dart';
import 'compass.dart';

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
    final settings = context.watch<SettingsController>();

    return Container(
      color: theme.colorScheme.surfaceBright,
      child: Wrap(
        spacing: 8,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          if (settings.cozyCompass)
            SizedBox(
              height: 40,
              child: AspectRatio(
                aspectRatio: 1,
                child: Compass(
                  to: model.route?.coordinates ??
                      model.boulder?.coordinates ??
                      model.area?.center ??
                      model.crag.center,
                ),
              ),
            ),
          if (model.area != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () => context.read<ExplorerModel>().setCrag(),
              child: Text(model.crag.name),
            ),
            divider(theme),
          ],
          if (model.boulder != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () =>
                  context.read<ExplorerModel>().setArea(model.area!.id),
              child: Text(model.area!.name),
            ),
            divider(theme),
          ],
          if (model.route != null) ...[
            FilledButton(
              style: const ButtonStyle(
                visualDensity: VisualDensity.compact,
              ),
              onPressed: () =>
                  context.read<ExplorerModel>().setBoulder(model.boulder!.id),
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

/// Re-usable wrapping row for diagrams to have them line up nicely, for chart and compass
/// NOTE: We are prototyping, compass may go elsewhere
class DiagramsLayout extends StatelessWidget {
  const DiagramsLayout({super.key, this.chart});

  final Widget? chart;

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsController>(context);
    final model = context.watch<ExplorerModel>();

    return Wrap(
      spacing: 16.0,
      runSpacing: 12.0,
      runAlignment: WrapAlignment.center,
      alignment: WrapAlignment.spaceAround,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        if (chart != null)
          SizedBox(
            height: 216,
            child: AspectRatio(
              aspectRatio: 2,
              child: chart,
            ),
          ),
        if (!settings.cozyCompass)
          SizedBox(
            height: 140,
            child: AspectRatio(
              aspectRatio: 1,
              child: Compass(
                to: model.route?.coordinates ??
                    model.boulder?.coordinates ??
                    model.area?.center ??
                    model.crag.center,
              ),
            ),
          ),
      ],
    );
  }
}
