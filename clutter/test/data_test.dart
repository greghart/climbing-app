import 'package:clutter/data.dart';
import 'package:clutter/entities/index.dart' as entities;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Data loading', () {
    test('should load crag json successfully', () async {
      WidgetsFlutterBinding.ensureInitialized();
      final crag = Data(await rootBundle.loadString("assets/santee.json")).crag;
      expect(crag.name, equals("Santee"));
      expect(crag.description, equals("It's not great, but it is Santee"));
      expect(crag.bounds, isNotNull);
      expect(
          crag.center,
          equals(
            const entities.LatLng(32.85052, -117.02223),
          ));
      expect(crag.areas, hasLength(4));
    });
  });
}
