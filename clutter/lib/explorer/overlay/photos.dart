import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/index.dart' as entities;
import '../../settings/settings_controller.dart';
import '../model.dart';
import 'topo.dart';

class Photos extends StatelessWidget {
  final List<entities.Photo> photos;
  const Photos({
    super.key,
    required this.photos,
    this.areaId,
    this.boulderId,
    this.routeId,
  });

  // Used to filter which topogons are shown
  final int? areaId;
  final int? boulderId;
  final int? routeId;

  @override
  Widget build(BuildContext context) {
    if (photos.isEmpty) {
      return const SizedBox.shrink();
    }
    final model = context.read<ExplorerModel>();
    final theme = Theme.of(context);

    return Column(
      spacing: 8,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Photos",
          style: theme.textTheme.headlineSmall,
        ),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: photos.length,
            itemBuilder: (context, index) {
              final photo = photos[index];
              return GestureDetector(
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Topo(
                      model: model,
                      photo: photo,
                      labels: false,
                      debug: false,
                      areaId: areaId,
                      boulderId: boulderId,
                      routeId: routeId,
                      interactive: false,
                    ),
                  ),
                ),
                onTap: () {
                  showTopoDialog(context, photo, index, model);
                },
              );
            },
          ),
        ),
      ],
    );
  }

  showTopoDialog(BuildContext context, entities.Photo photo, int index,
      ExplorerModel model) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return Dialog.fullscreen(
            child: PhotosDialog(
              photos: photos,
              index: index,
              child: Topo(
                model: model,
                photo: photo,
                areaId: areaId,
                boulderId: boulderId,
                routeId: routeId,
                interactive: false,
              ),
              onPhotoNav: (i) {
                Navigator.of(context).pop();
                showTopoDialog(context, photos[i], i, model);
              },
            ),
          );
        });
  }
}

// Layout expands all space available.
// Given a child, it will center it vertically, with a tab photo selector at bottom.
// Buttons or swipes left or right will navigate photos
class PhotosDialog extends StatelessWidget {
  const PhotosDialog({
    super.key,
    required this.child,
    required this.photos,
    required this.index,
    this.swipeSensitivity = 500,
    this.onPhotoNav,
  });

  final Widget child;
  final List<entities.Photo> photos;
  final int index;
  final int swipeSensitivity;
  final Function(int i)? onPhotoNav;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    navigateLeft() {
      onPhotoNav?.call(
        index > 0 ? index - 1 : photos.length - 1,
      );
    }

    navigateRight() {
      onPhotoNav?.call(
        index < photos.length - 1 ? index + 1 : 0,
      );
    }

    return LayoutBuilder(builder: (context, constraints) {
      return Column(
        spacing: 8,
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height:
                constraints.maxHeight - 56, // 48 (size of buttons) + 8 spacing
            child: Stack(
              children: [
                PhotosViewer(child: child),
                Positioned(
                  right: -2,
                  top: -9,
                  child: IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: theme.colorScheme.secondaryContainer
                          .withValues(alpha: 0.2),
                    ),
                    icon: Icon(
                      Icons.cancel,
                      color: theme.colorScheme.onSecondaryContainer,
                      size: 36,
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                Positioned(
                  left: 2,
                  top: -9,
                  child: IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: theme.colorScheme.secondaryContainer
                          .withValues(alpha: 0.2),
                    ),
                    icon: Icon(
                      Icons.fullscreen,
                      color: theme.colorScheme.onSecondaryContainer,
                      size: 36,
                    ),
                    onPressed: () =>
                        context.read<SettingsController>().toggleWideImages(),
                  ),
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              IconButton(
                splashRadius: 16.0,
                padding: EdgeInsets.zero,
                onPressed: () {
                  navigateLeft();
                },
                icon: const Icon(
                  Icons.arrow_left_rounded,
                  size: 32.0,
                ),
              ),
              Row(
                spacing: 2,
                children: photos.mapIndexed((i, p) {
                  return TabPageSelectorIndicator(
                    backgroundColor: i == index
                        ? theme.colorScheme.secondary
                        : Colors.transparent,
                    borderColor: theme.colorScheme.secondary,
                    size: 12.0,
                  );
                }).toList(),
              ),
              IconButton(
                splashRadius: 16.0,
                padding: EdgeInsets.zero,
                onPressed: () {
                  navigateRight();
                },
                icon: const Icon(
                  Icons.arrow_right_rounded,
                  size: 32.0,
                ),
              ),
            ],
          ),
        ],
      );
    });
  }
}

// Simple widget to decide whether we're in "wide" mode or not
class PhotosViewer extends StatelessWidget {
  const PhotosViewer({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsController>();
    if (settings.wideImages) {
      // Wide images should take up infinite width and scroll
      return ListView(
        scrollDirection: Axis.horizontal,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              child,
            ],
          ),
        ],
      );
    }
    return child;
  }
}
