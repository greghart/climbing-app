import 'dart:math' as math;

import 'package:flutter/foundation.dart' as foundation;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../settings/settings_controller.dart';
import '../model.dart';
import '../tutorial.dart';

/// OverlaySheet is a DraggableScrollableSheet that works on both
/// mobile and desktop, showing just a preview of the current view
/// by default, and expanding to show more scrollable content when dragged up.
class OverlaySheet extends StatefulWidget {
  const OverlaySheet({
    super.key,
    required this.sliver,
  });

  final Widget sliver;

  @override
  State<OverlaySheet> createState() => _OverlaySheetState();
}

class _OverlaySheetState extends State<OverlaySheet> {
  static const double minPosition = 0.01;
  static const double maxPosition = 0.7;
  static const double _dragSensitivity = 600;
  late double _sheetPosition;

  @override
  void initState() {
    super.initState();
    _sheetPosition = context.read<ExplorerSheetModel>().sheetPosition;
  }

  setClamped(double value) {
    _sheetPosition = math.max(minPosition, math.min(value, maxPosition));
    context.read<ExplorerSheetModel>().setSheetPosition(_sheetPosition);
  }

  bool _handleScrollNotification(DraggableScrollableNotification n) {
    context.read<ExplorerSheetModel>().setSheetPosition(n.extent);
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final isExpanded = _sheetPosition > (maxPosition - minPosition) / 2;
    final model = context.watch<ExplorerModel>();

    return DraggableScrollableSheet(
      initialChildSize: _sheetPosition,
      minChildSize: minPosition,
      maxChildSize: maxPosition,
      snap: true,
      snapSizes: const [0.2, 0.5, maxPosition],
      builder: (BuildContext context, ScrollController scrollController) {
        context
            .read<ExplorerSheetModel>()
            .setScrollController(scrollController);
        return ColoredBox(
          key: context.read<SettingsController>().explorerTutorial
              ? explorerOverlayKey
              : null,
          color: colorScheme.surfaceBright,
          child: Column(
            children: [
              Grabber(
                onVerticalDragUpdate: (DragUpdateDetails details) {
                  setState(() {
                    setClamped(
                        _sheetPosition - details.delta.dy / _dragSensitivity);
                  });
                },
                onTap: () {
                  setState(() {
                    if (isExpanded) {
                      setClamped(minPosition);
                    } else {
                      setClamped(maxPosition);
                    }
                  });
                },
                isExpanded: isExpanded,
                isOnDesktopAndWeb: _isOnDesktopAndWeb,
              ),
              Flexible(
                child: NotificationListener<DraggableScrollableNotification>(
                  onNotification: _handleScrollNotification,
                  child: CustomScrollView(
                    controller: scrollController,
                    restorationId: "${model.entityType}${model.entityId}",
                    slivers: [
                      SliverPadding(
                        padding: const EdgeInsets.all(8.0),
                        sliver: widget.sliver,
                        // sliver: SliverMainAxisGroup(
                        //   slivers: [
                        //     SliverToBoxAdapter(child: Breadcrumbs(title: "test")),
                        //     SliverToBoxAdapter(child: Divider()),
                        //     SliverToBoxAdapter(child: Text("test")),
                        //   ],
                        // ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  bool get _isOnDesktopAndWeb {
    if (foundation.kIsWeb) {
      return true;
    }
    switch (foundation.defaultTargetPlatform) {
      case TargetPlatform.macOS:
      case TargetPlatform.linux:
      case TargetPlatform.windows:
        return true;
      case TargetPlatform.android:
      case TargetPlatform.iOS:
      case TargetPlatform.fuchsia:
        return false;
    }
  }
}

/// OverlaySheet can work with dynamic children widgets, so we want
/// to ensure overlay/scroll context is passed down if needed
class ScrollableContext {
  const ScrollableContext({
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });

  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;
}

/// A draggable widget that accepts vertical drag gestures
/// and this is only visible on desktop and web platforms.
class Grabber extends StatelessWidget {
  const Grabber({
    super.key,
    required this.onVerticalDragUpdate,
    required this.isOnDesktopAndWeb,
    required this.isExpanded,
    this.onTap,
  });

  final ValueChanged<DragUpdateDetails> onVerticalDragUpdate;
  final void Function()? onTap;
  final bool isOnDesktopAndWeb;
  final bool isExpanded;

  @override
  Widget build(BuildContext context) {
    if (!isOnDesktopAndWeb) {
      return const SizedBox.shrink();
    }
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    const Icon expandMore = Icon(Icons.expand_more);
    const Icon expandLess = Icon(Icons.expand_less);

    return GestureDetector(
      // Drag to wherever
      onVerticalDragUpdate: onVerticalDragUpdate,
      child: Container(
        width: double.infinity,
        color: colorScheme.secondaryContainer,
        child: Align(
          alignment: Alignment.topCenter,
          // Click to open or close
          child: GestureDetector(
            onTap: () {
              onTap?.call();
            },
            child: IconButton(
              visualDensity: VisualDensity.compact,
              onPressed: onTap,
              color: colorScheme.onSecondaryContainer,
              icon: isExpanded ? expandLess : expandMore,
            ),
          ),
        ),
      ),
    );
  }
}
