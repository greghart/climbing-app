import 'dart:math' as math;

import 'package:collection/collection.dart';
import 'package:flutter/material.dart';

import '../../entities/index.dart' as entities;
import '../model.dart';
import 'topo_sizer.dart';

// Rainbow colors to use to help distinguish lots of routes on one boulder
buildRainbowColor(Color c) {
  return ColorScheme.fromSeed(
    brightness: Brightness.light,
    contrastLevel: 0.05,
    seedColor: c,
  );
}

final rainbow = [
  buildRainbowColor(Colors.red),
  buildRainbowColor(Colors.orange),
  buildRainbowColor(Colors.yellow),
  buildRainbowColor(Colors.green),
  buildRainbowColor(Colors.blue),
  buildRainbowColor(Colors.indigo),
  buildRainbowColor(Colors.deepPurple),
];

const characters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

/// Topo widget, likely shown as a full screen dialog, with a photo
/// and drawn lines on top
class Topo extends StatelessWidget {
  const Topo({
    super.key,
    required this.photo,
    required this.model,
    this.labels = true,
    this.debug = false,
    this.areaId,
    this.boulderId,
    this.routeId,
  });

  final entities.Photo photo;
  // Since topo is shown in a dialog, it can't actually use context
  final ExplorerModel model;
  // Show labels?
  final bool labels;
  // Show debug img info as text
  final bool debug;
  // Used to filter which topogons are shown
  final int? areaId;
  final int? boulderId;
  final int? routeId;

  @override
  Widget build(BuildContext context) {
    return TopoSizer(
      photo: photo,
      builder: (BuildContext context, TopoSizeData data) {
        final topogons = photo.topo!.topogons.where(
          (t) =>
              (areaId == null || t.areaId == areaId) &&
              (boulderId == null || t.boulderId == boulderId) &&
              (routeId == null || t.routeId == routeId),
        );
        final photoWidget = ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: data.image,
        );
        final debugWidget = Column(
          children: [
            Text("Img: ${data.imageSize.width} x ${data.imageSize.height}"),
            Text("Out: ${data.outSize.width} x ${data.outSize.height}"),
            Text(
                "Fitted: ${data.fittedSize.width} x ${data.fittedSize.height}"),
            Text("Scale: ${data.scale}"),
          ],
        );
        handleTopogonRoute(entities.Topogon t) {
          Navigator.of(context).pop();
          if (t.areaId != null) {
            model.setArea(t.areaId!);
          }
          if (t.boulderId != null) {
            model.setBoulder(t.boulderId!);
          }
          if (t.routeId != null) {
            model.setRoute(t.routeId!);
          }
        }

        // In certain cases, we may not want to put labels onto photo
        // If there's not much room (low scale, lots of topogons), we can try putting labels underneath
        final separateLabels =
            data.scale <= 0.5 && labels == true && topogons.length > 5;
        final paintWidget = CustomPaint(
          size: data.fittedSize,
          painter: TopoPainter(
            topogons: topogons.toList(),
            scale: data.scale,
            separateLabels: separateLabels,
          ),
        );

        if (!separateLabels) {
          return InteractiveViewer(
            boundaryMargin: const EdgeInsets.all(40.0),
            minScale: 0.8,
            maxScale: 3,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                photoWidget,
                if (debug) debugWidget,
                // Paint all our canvas things
                paintWidget,
                // Labels can just be chips positioned correctly
                if (labels)
                  ...topogons.expandIndexed((i, t) {
                    ColorScheme rainbowColor = rainbow[i % rainbow.length];
                    return t.data.labels.map((l) {
                      var text = l.text;
                      if (text.isEmpty) {
                        if (t.routeId != null) {
                          final route = model.routesById[t.routeId.toString()]!;
                          text = "${route.name} (${route.grade.raw})";
                        }
                      }
                      return Positioned(
                        top: l.point.y * data.scale,
                        left: l.point.x * data.scale,
                        child: FilledButton(
                          style: FilledButton.styleFrom(
                            backgroundColor: rainbowColor.primaryContainer,
                            visualDensity: VisualDensity.compact,
                          ),
                          onPressed: () => handleTopogonRoute(t),
                          child: Text(
                            text,
                            style: TextStyle(
                              color: rainbowColor.onPrimaryContainer,
                            ),
                          ),
                        ),
                      );
                    });
                  }),
              ],
            ),
          );
        }
        final theme = Theme.of(context);
        return Column(
          children: [
            SizedBox(
              width: data.fittedSize.width,
              height: data.fittedSize.height,
              child: InteractiveViewer(
                boundaryMargin: const EdgeInsets.all(40.0),
                minScale: 0.8,
                maxScale: 3,
                child: Stack(
                  children: [
                    photoWidget,
                    if (debug) debugWidget,
                    paintWidget,
                  ],
                ),
              ),
            ),
            SizedBox.fromSize(
              size: Size(
                data.outSize.width,
                data.outSize.height - data.fittedSize.height,
              ),
              child: ListView(
                children: topogons.mapIndexed((i, t) {
                  var text = "";
                  if (t.routeId != null) {
                    final route = model.routesById[t.routeId.toString()]!;
                    text = "${route.name} (${route.grade.raw})";
                  }
                  Color color = rainbow[i % rainbow.length].onPrimaryContainer;
                  Color fill = rainbow[i % rainbow.length].primaryContainer;
                  return ListTile(
                    dense: true,
                    tileColor: fill,
                    onTap: () => handleTopogonRoute(t),
                    trailing: const Icon(Icons.navigate_next),
                    title: RichText(
                      text: TextSpan(
                        style:
                            theme.textTheme.bodyMedium!.copyWith(color: color),
                        children: <TextSpan>[
                          TextSpan(
                            text: "(${characters[i % characters.length]}) ",
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          TextSpan(text: text),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        );
      },
    );
  }
}

class TopoPainter extends CustomPainter {
  final List<entities.Topogon> topogons;
  final double scale;
  // If we have separate labels, display a character circle (eg. 'A') at each route instead to help correlate, and use rainbow colors
  final bool separateLabels;

  const TopoPainter({
    required this.topogons,
    required this.scale,
    required this.separateLabels,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // This code is loose for "perf" reasons, no I'm just lazy
    math.Point<double>? separateLabelPoint;
    for (final (index, t) in topogons.indexed) {
      ColorScheme rainbowColor = rainbow[index % rainbow.length];
      // Draw lines
      final linePaint = Paint()
        ..strokeWidth = 4
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke;
      for (var line in t.data.lines) {
        linePaint.color = rainbowColor.primaryContainer;
        // Setup path
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

    // All separate labels should be on top of any line
    for (final (index, t) in topogons.indexed) {
      ColorScheme rainbowColor = rainbow[index % rainbow.length];

      // Add a character circle if separate labels to help correlate
      if (separateLabels) {
        final circlePaint = Paint()
          ..color = rainbowColor.primaryContainer
          ..style = PaintingStyle.fill;
        final textPainter = TextPainter(
          text: TextSpan(
            text: characters[index % characters.length],
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: rainbowColor.onPrimaryContainer,
              fontSize: 14,
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        var start = math.Point(
          t.data.lines[0].points[0].x * scale,
          t.data.lines[0].points[0].y * scale,
        );
        if (separateLabelPoint != null &&
            start.distanceTo(separateLabelPoint) < 20) {
          start = math.Point(start.x, start.y - 30);
        }
        canvas.drawCircle(Offset(start.x, start.y), 14, circlePaint);

        textPainter.paint(
          canvas,
          Offset(
            start.x - 6,
            start.y - 7,
          ),
        );

        separateLabelPoint = start;
      }
    }
  }

  @override
  bool shouldRepaint(TopoPainter oldDelegate) {
    return oldDelegate.topogons != topogons || oldDelegate.scale != scale;
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
