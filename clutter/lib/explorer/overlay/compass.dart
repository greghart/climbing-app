import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart' as latlng;
import 'package:provider/provider.dart';

import '../model.dart';

class Compass extends StatelessWidget {
  const Compass({
    super.key,
    required this.to,
  });

  final latlng.LatLng to;

  @override
  Widget build(BuildContext context) {
    final locations = Provider.of<ExplorerLocationModel>(context);
    return LayoutBuilder(
      builder: (context, constraints) {
        double heading = locations.currentHeading.heading;
        double toHeading = headingFromCoordinates(
          toRadians(locations.currentPosition.latitude),
          toRadians(locations.currentPosition.longitude),
          toRadians(to.latitude),
          toRadians(to.longitude),
        );

        return SizedBox(
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: Size(constraints.maxWidth, constraints.maxHeight),
                painter: CompassCustomPainter(
                  heading: normalizeRads(heading),
                  toHeading: normalizeRads(toHeading),
                  accuracy: locations.currentHeading.accuracy,
                ),
              ),
              Text(
                buildHeadingFirstLetter(toDegrees(normalizeRads(heading))),
                style: TextStyle(
                  color: Colors.grey[700]!,
                  fontSize: constraints.maxHeight / 3,
                  // fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class CompassCustomPainter extends CustomPainter {
  final double heading;
  final double accuracy;
  final double toHeading;

  const CompassCustomPainter({
    required this.heading,
    required this.toHeading,
    required this.accuracy,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final diameter = size.height; // compass should be setup in box
    final radius = size.height / 2;
    // Center The Compass In The Middle Of The Screen
    canvas.translate(radius, radius);

    Paint circle = Paint()
      ..strokeWidth = math.max(radius * .02, 2)
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    Paint shadowCircle = Paint()
      ..strokeWidth = math.max(radius * .02, 2)
      ..color = Colors.grey.withValues(alpha: 0.2)
      ..style = PaintingStyle.fill;

    // Draw Outer Circle
    canvas.drawCircle(Offset.zero, radius, circle);

    Paint darkIndexLine = Paint()
      ..color = Colors.grey[700]!
      ..strokeWidth = math.max(radius * .06, 3)
      ..strokeCap = StrokeCap.round;

    Paint lightIndexLine = Paint()
      ..color = Colors.grey
      ..strokeWidth = radius * .03
      ..strokeCap = StrokeCap.round;

    Paint northTriangle = Paint()
      ..color = Colors.red
      ..style = PaintingStyle.fill
      ..strokeCap = StrokeCap.round
      ..strokeWidth = math.max(radius * .04, 3);

    Paint toPoint = Paint()
      ..color = Colors.green
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = math.max(radius * .06, 3);

    canvas.rotate(-math.pi / 2);

    // Draw The Light Grey Lines 16 Times While Rotating 22.5° Degrees
    for (int i = 1; i <= 16; i++) {
      canvas.drawLine(
          Offset.fromDirection(-(heading + toRadians(22.5) * i), radius * .6),
          Offset.fromDirection(-(heading + toRadians(22.5) * i), radius * .8),
          lightIndexLine);
    }

    // Draw The Dark Grey Lines 3 Times While Rotating 90° Degrees
    for (int i = 1; i <= 3; i++) {
      canvas.drawLine(
          Offset.fromDirection(-(heading + toRadians(90) * i), radius * .6),
          Offset.fromDirection(-(heading + toRadians(90) * i), radius * .8),
          darkIndexLine);
    }

    // Draw North Triangle
    Path path = Path();
    path.moveTo(
      Offset.fromDirection(-heading, radius * .85).dx,
      Offset.fromDirection(-heading, radius * .85).dy,
    );
    path.lineTo(
      Offset.fromDirection(-(heading + toRadians(15)), radius * .6).dx,
      Offset.fromDirection(-(heading + toRadians(15)), radius * .6).dy,
    );
    path.lineTo(
      Offset.fromDirection(-(heading - toRadians(15)), radius * .6).dx,
      Offset.fromDirection(-(heading - toRadians(15)), radius * .6).dy,
    );
    path.close();
    canvas.drawPath(path, northTriangle);

    // Draw Arc toward boulder with our accuracy
    double toward = toHeading - heading;
    canvas.drawArc(
      Rect.fromCircle(
        center: Offset.zero,
        radius: radius * .95,
      ),
      toward - accuracy / 2,
      accuracy,
      false,
      toPoint,
    );

    // Draw Shadow For Inner Circle
    canvas.drawCircle(Offset.zero, radius * .68, shadowCircle);

    // Draw Inner Circle (last so it overlaps strokes and shadow)
    canvas.drawCircle(Offset.zero, radius * .65, circle);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}

// TODO: Refactor to suncalc
double toRadians(double degrees) {
  return degrees * math.pi / 180;
}

double toDegrees(double rad) {
  return rad * 180 / math.pi;
}

double headingFromCoordinates(
    double lat1, double long1, double lat2, double long2) {
  double dLon = (long2 - long1);

  double y = math.sin(dLon) * math.cos(lat2);
  double x = math.cos(lat1) * math.sin(lat2) -
      math.sin(lat1) * math.cos(lat2) * math.cos(dLon);

  return math.atan2(y, x);
}

String buildHeadingFirstLetter(double direction) {
  if (direction > 330 || direction <= 30) {
    return 'N';
  } else if (direction > 30 && direction <= 60) {
    return 'NE';
  } else if (direction > 60 && direction <= 120) {
    return 'E';
  } else if (direction > 120 && direction <= 150) {
    return 'SE';
  } else if (direction > 150 && direction <= 210) {
    return 'S';
  } else if (direction > 210 && direction <= 240) {
    return 'SW';
  } else if (direction > 240 && direction <= 300) {
    return 'W';
  }

  return 'NW';
}
