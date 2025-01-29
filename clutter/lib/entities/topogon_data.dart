import 'dart:math' as math;
import 'dart:ui';

import 'package:flutter/material.dart';

import 'types.dart';

class TopogonPoint {
  final double x;
  final double y;

  TopogonPoint({required this.x, required this.y});

  factory TopogonPoint.fromJson(Map<String, dynamic> json) {
    return TopogonPoint(
      x: json['x'],
      y: json['y'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'x': x,
      'y': y,
    };
  }

  double distanceTo(TopogonPoint other) {
    final a = x - other.x;
    final b = y - other.y;
    return math.sqrt(a * a + b * b);
  }

  static double distanceBetween(TopogonPoint a, TopogonPoint b) {
    final x = a.x - b.x;
    final y = a.y - b.y;
    return math.sqrt(x * x + y * y);
  }
}

class TopogonLine {
  final List<TopogonPoint> points;
  final Color color;
  final double tension;

  TopogonLine(
      {required this.points, required this.color, required this.tension});

  factory TopogonLine.fromJson(Map<String, dynamic> json) {
    return TopogonLine(
      points: (json['points'] as List)
          .map((p) => TopogonPoint.fromJson(p))
          .toList(),
      color: _parseColor(json['color']),
      tension: json['tension'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((p) => p.toJson()).toList(),
      'color': color,
      'tension': tension,
    };
  }
}

class Label {
  final String text;
  final TopogonPoint point;
  final Color color;
  final Color fill;
  final String direction;

  Label({
    required this.text,
    required this.point,
    required this.color,
    required this.fill,
    required this.direction,
  });

  factory Label.fromJson(Map<String, dynamic> json) {
    return Label(
      text: json['text'],
      point: TopogonPoint.fromJson(json['point']),
      color: _parseColor(json['color']),
      fill: _parseColor(json['fill']),
      direction: json['direction'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'text': text,
      'point': point.toJson(),
      'color': color.toString(),
      'fill': fill,
      'direction': direction,
    };
  }
}

class TopogonData {
  final List<TopogonLine> lines;
  final List<Label> labels;

  TopogonData({required this.lines, required this.labels});

  factory TopogonData.fromJson(Map<String, dynamic> json) {
    if (json
        case {
          'lines': List lines,
          'labels': List labels,
        }) {
      return TopogonData(
        lines: lines.map((l) => TopogonLine.fromJson(l)).toList(),
        labels: labels.map((l) => Label.fromJson(l)).toList(),
      );
    }
    throw JSONException("TopogonData", json);
  }

  Map<String, dynamic> toJson() {
    return {
      'lines': lines.map((l) => l.toJson()).toList(),
      'labels': labels.map((l) => l.toJson()).toList(),
    };
  }
}

Color _parseColor(String color) {
  if (color.startsWith("#")) {
    return _hexToColor(color);
  }
  if (color.startsWith("rgb")) {
    final parts = color.substring(4, color.length - 1).split(",");
    return Color.fromARGB(
      255,
      int.parse(parts[0]),
      int.parse(parts[1]),
      int.parse(parts[2]),
    );
  }
  return Colors.green;
}

Color _hexToColor(String code) {
  return Color(int.parse(code.substring(1, 7), radix: 16) + 0xFF000000);
}
