import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' as foundation;

/// OverlayView is a DraggableScrollableSheet that works on both
/// mobile and desktop, showing just a preview of the current view
/// by default, and expanding to show more scrollable content when dragged up.
class OverlaySheet extends StatefulWidget {
  const OverlaySheet({
    super.key,
    this.child,
  });

  final Widget? child;

  @override
  State<OverlaySheet> createState() => _OverlaySheetState();
}

class _OverlaySheetState extends State<OverlaySheet> {
  static const double minPosition = 0.2;
  static const double maxPosition = 0.8;
  double _sheetPosition = math.max(minPosition, math.min(0.5, maxPosition));
  final double _dragSensitivity = 600;

  setClamped(double value) {
    _sheetPosition = math.max(minPosition, math.min(value, maxPosition));
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final isExpanded = _sheetPosition > (maxPosition - minPosition) / 2;

    return DraggableScrollableSheet(
      key: const Key('overlay-sheet'),
      initialChildSize: _sheetPosition,
      minChildSize: minPosition,
      maxChildSize: maxPosition,
      builder: (BuildContext context, ScrollController scrollController) {
        return ColoredBox(
          color: colorScheme.primary,
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
                child: widget.child ?? const Text('Overlay content'),
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

/// A draggable widget that accepts vertical drag gestures
/// and this is only visible on desktop and web platforms.
/// TODO: Change this to an expander button instead
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
        color: colorScheme.onSurface,
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
              icon: isExpanded ? expandLess : expandMore,
            ),
          ),
        ),
      ),
    );
  }
}
