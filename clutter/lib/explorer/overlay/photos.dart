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

  static const swipeSensitivity = 500;

  showTopoDialog(BuildContext context, entities.Photo photo, int index,
      ExplorerModel model) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          final settings = context.watch<SettingsController>();
          final theme = Theme.of(context);
          navigateLeft() {
            Navigator.of(context).pop();
            if (index > 0) {
              index = index - 1;
            } else {
              index = photos.length - 1;
            }
            showTopoDialog(context, photos[index], index, model);
          }

          navigateRight() {
            Navigator.of(context).pop();
            if (index < photos.length - 1) {
              index = index + 1;
            } else {
              index = 0;
            }
            showTopoDialog(context, photos[index], index, model);
          }

          Widget? child;
          if (settings.wideImages) {
            // Row gives infinite width constraint to topo, which means we will only
            // constrain height for photo. That keeps photo from becoming too small on
            // portrait phones, but would overflow, so we let user scroll to see buttons
            child = SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    visualDensity: VisualDensity.compact,
                    onPressed: () {
                      navigateLeft();
                    },
                    tooltip: "Left",
                    icon: const Icon(Icons.arrow_left),
                  ),
                  Topo(
                    model: model,
                    photo: photo,
                    areaId: areaId,
                    boulderId: boulderId,
                    routeId: routeId,
                  ),
                  IconButton(
                    padding: EdgeInsets.zero,
                    visualDensity: VisualDensity.compact,
                    onPressed: () {
                      navigateRight();
                    },
                    tooltip: "Right",
                    icon: const Icon(Icons.arrow_right),
                  ),
                ],
              ),
            );
          } else {
            child = LayoutBuilder(builder: (context, constraints) {
              return Column(
                spacing: 8,
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    height: constraints.maxHeight - 48,
                    child: Stack(
                      children: [
                        InteractiveViewer(
                          minScale: 1,
                          maxScale: 3,
                          child: Topo(
                            model: model,
                            photo: photo,
                            areaId: areaId,
                            boulderId: boulderId,
                            routeId: routeId,
                          ),
                        ),
                        Positioned(
                          right: -2,
                          top: -9,
                          child: IconButton(
                            icon: Icon(
                              Icons.cancel,
                              color: Colors.black.withValues(alpha: 0.5),
                              size: 36,
                            ),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onHorizontalDragEnd: (details) {
                      if (details.primaryVelocity! > swipeSensitivity) {
                        // User swiped right , move left
                        navigateLeft();
                      } else if (details.primaryVelocity! < -swipeSensitivity) {
                        // User swiped left, move right
                        navigateRight();
                      }
                    },
                    child: Row(
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
                  ),
                ],
              );
            });
          }
          return Dialog.fullscreen(
            child: child,
          );
        });
  }
}
