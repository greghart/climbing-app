import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../entities/index.dart' as entities;

// TopoSizer is a widget builder for topos.
// For the given photo, if there's not a topo, it just returns a contained image.
// Otherwise, we calculate how much the image will be scaled down to fit into
// its' parent, as well as adjust for the topo scale, and pass that data down to builder.
class TopoSizer extends StatelessWidget {
  final entities.Photo photo;
  final Widget Function(BuildContext context, TopoSizeData data) builder;

  const TopoSizer({
    super.key,
    required this.photo,
    required this.builder,
  });

  @override
  Widget build(BuildContext context) {
    final img = Image.asset(
      "assets/photos/${photo.upload!.key}",
      fit: BoxFit.contain,
      alignment: Alignment.center,
    );
    if (photo.topo == null) {
      return img;
    }
    Completer<ui.Image> completer = Completer<ui.Image>();
    img.image.resolve(const ImageConfiguration()).addListener(
        ImageStreamListener(
            (ImageInfo info, bool _) => completer.complete(info.image)));
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final outputSize = Size(constraints.maxWidth, constraints.maxHeight);
        return FutureBuilder<ui.Image>(
          future: completer.future,
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return const SizedBox(
                  width: 25, height: 25, child: LinearProgressIndicator());
            }

            final imgSize = Size(snapshot.data!.width.toDouble(),
                snapshot.data!.height.toDouble());
            final fitted = applyBoxFit(BoxFit.contain, imgSize, outputSize);
            final aspectImg = snapshot.data!.width / snapshot.data!.height;
            final aspectCanvas = outputSize.width / outputSize.height;
            // Scale it down to fit. The image in app is scaled, and then the topo was scaled as well
            final currentScale = math.min(
              aspectCanvas > aspectImg
                  ? outputSize.height / snapshot.data!.height
                  : outputSize.width / snapshot.data!.width,
              1,
            );
            final scale = // times 4 because we down size all images by 4x into app
                currentScale / (photo.topo!.scale * 4);
            return builder(
              context,
              TopoSizeData(
                image: img,
                imageSize: imgSize,
                outSize: outputSize,
                fittedSize: fitted.destination,
                aspectImage: aspectImg,
                aspectCanvas: aspectCanvas,
                scale: scale,
              ),
            );
          },
        );
      },
    );
  }
}

class TopoSizeData {
  const TopoSizeData({
    required this.image,
    required this.imageSize,
    required this.outSize,
    required this.fittedSize,
    required this.aspectImage,
    required this.aspectCanvas,
    required this.scale,
  });

  // The photo image itself
  final Widget image;
  // The size of the image asset
  final Size imageSize;
  // The max size of our parent constraints
  final Size outSize;
  // The size of the image fitted into parent based on BoxFit.contain
  final Size fittedSize;
  // The aspect ratio of the image
  final double aspectImage;
  // The aspect ratio of parent constraints
  final double aspectCanvas;
  // How much the topo should be scaled
  final double scale;
}
