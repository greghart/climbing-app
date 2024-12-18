import 'dart:math' as math;

import 'package:flutter/foundation.dart' as foundation;
import 'package:flutter/material.dart';

/// OverlayView is a DraggableScrollableSheet that works on both
/// mobile and desktop, showing just a preview of the current view
/// by default, and expanding to show more scrollable content when dragged up.
class OverlaySheet extends StatefulWidget {
  const OverlaySheet({
    super.key,
    this.build,
  });

  final Widget Function(
      ScrollController scrollController, bool isOnDesktopAndWeb)? build;

  @override
  State<OverlaySheet> createState() => _OverlaySheetState();
}

class _OverlaySheetState extends State<OverlaySheet> {
  static const double minPosition = 0.2;
  static const double maxPosition = 0.7;
  static const double defaultSheetPosition = 0.2;
  double _sheetPosition =
      math.max(minPosition, math.min(defaultSheetPosition, maxPosition));
  final double _dragSensitivity = 600;

  setClamped(double value) {
    _sheetPosition = math.max(minPosition, math.min(value, maxPosition));
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final isExpanded = _sheetPosition > (maxPosition - minPosition) / 2;

    return DraggableScrollableSheet(
      initialChildSize: _sheetPosition,
      minChildSize: minPosition,
      maxChildSize: maxPosition,
      snap: true,
      snapSizes: const [minPosition, 0.5, maxPosition],
      builder: (BuildContext context, ScrollController scrollController) {
        return ColoredBox(
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
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: widget.build
                          ?.call(scrollController, _isOnDesktopAndWeb) ??
                      const Text('Overlay content'),
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
