import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../entities/index.dart' as entities;

/// Topo widget, likely shown as a full screen dialog, with a photo
/// and drawn lines on top
class Topo extends StatelessWidget {
  const Topo({super.key, required this.photo});

  final entities.Photo photo;

  @override
  Widget build(BuildContext context) {
    // If this photo has a topo, show all the topogons!
    // TODO: Scale the drawn topogon components based on how image is currently scaled
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
      // With constraints, we can predict what size our image will be based on its' aspect
      // ratio and `BoxFit.contain` fitting
      builder: (BuildContext context, BoxConstraints constraints) {
        final outputSize = Size(constraints.maxWidth, constraints.maxHeight);
        return FutureBuilder<ui.Image>(
          future: completer.future,
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return const LinearProgressIndicator();
            }
            final inputSize = Size(snapshot.data!.width.toDouble(),
                snapshot.data!.height.toDouble());
            final fitted = applyBoxFit(BoxFit.contain, inputSize, outputSize);
            final aspectImg = snapshot.data!.width / snapshot.data!.height;
            final aspectCanvas = outputSize.width / outputSize.height;
            // Scale it down to fit
            final scale = aspectCanvas > aspectImg
                ? outputSize.height / snapshot.data!.height
                : outputSize.width / snapshot.data!.width;
            return Stack(children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: img,
              ),
              Column(
                children: [
                  Text("${snapshot.data!.width} x ${snapshot.data!.height}"),
                  Text(
                      "${fitted.destination.width} x ${fitted.destination.height}"),
                  Text("Scale: $scale"),
                ],
              ),
              CustomPaint(
                size: fitted.destination,
                painter: TopoPainter(
                  topo: photo.topo!,
                  // times 4 because we down size all images by 4x into app
                  scale: scale / (photo.topo!.scale * 4),
                ),
              ),
            ]);
          },
        );
      },
    );
  }
}

class TopoPainter extends CustomPainter {
  final entities.Topo topo;
  final double scale;

  const TopoPainter({
    required this.topo,
    required this.scale,
  });

  @override
  void paint(Canvas canvas, Size size) {
    for (var t in topo.topogons) {
      for (var line in t.data.lines) {
        // Setup path
        Paint linePaint = Paint()
          ..color = line.color
          ..strokeWidth = 4
          ..strokeCap = StrokeCap.round
          ..style = PaintingStyle.stroke;
        final path = Path()
          ..moveTo(line.points[0].x * scale, line.points[0].y * scale);

        // Draw a curvy tension line, or just draw lines
        if (line.tension != 0 && line.points.length > 2) {
          final points = _expandPoints(line.points, line.tension);
          path.quadraticBezierTo(
            points[0].x * scale, // cp
            points[0].y * scale,
            points[1].x * scale, // p
            points[1].y * scale,
          );
          for (int n = 2; n < points.length - 1; n += 3) {
            path.cubicTo(
              points[n].x * scale, // cp
              points[n].y * scale,
              points[n + 1].x * scale, // cp
              points[n + 1].y * scale,
              points[n + 2].x * scale, // p
              points[n + 2].y * scale,
            );
          }
          path.quadraticBezierTo(
            points[points.length - 1].x * scale, // cp
            points[points.length - 1].y * scale,
            line.points[line.points.length - 1].x * scale, // p
            line.points[line.points.length - 1].y * scale,
          );
        } else {
          for (var i = 1; i < line.points.length; i++) {
            path.lineTo(line.points[i].x * scale, line.points[i].y * scale);
          }
        }
        canvas.drawPath(path, linePaint);
      }
    }
  }

  @override
  bool shouldRepaint(TopoPainter oldDelegate) {
    return oldDelegate.topo != topo || oldDelegate.scale != scale;
  }
}

List<double> _getControlPoints(double x0, double y0, double x1, double y1,
    double x2, double y2, double t) {
  final d01 = math.sqrt(math.pow(x1 - x0, 2) + math.pow(y1 - y0, 2));
  final d12 = math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
  final fa = (t * d01) / (d01 + d12);
  final fb = (t * d12) / (d01 + d12);
  final p1x = x1 - fa * (x2 - x0);
  final p1y = y1 - fa * (y2 - y0);
  final p2x = x1 + fb * (x2 - x0);
  final p2y = y1 + fb * (y2 - y0);

  return [p1x, p1y, p2x, p2y];
}

// TODO: Use this to grab tension points above, and then use them to draw beziers
List<entities.TopogonPoint> _expandPoints(
    List<entities.TopogonPoint> points, double tension) {
  final len = points.length;
  final allPoints = <entities.TopogonPoint>[];

  for (var n = 1; n < len - 1; n += 1) {
    final cp = _getControlPoints(points[n - 1].x, points[n - 1].y, points[n].x,
        points[n].y, points[n + 1].x, points[n + 1].y, tension);
    allPoints.addAll([
      entities.TopogonPoint(x: cp[0], y: cp[1]),
      points[n],
      entities.TopogonPoint(x: cp[2], y: cp[3]),
    ]);
  }

  return allPoints;
}
