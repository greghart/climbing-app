import 'package:clutter/data.dart';
import 'package:clutter/models/index.dart' as models;
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Data loading', () {
    test('should load crag json successfully', () {
      expect(() => Data(), returnsNormally);
      final crag = Data().crag;
      expect(crag.name, equals("Santee"));
      expect(crag.description, equals("It's not great, but it is Santee"));
      expect(crag.bounds, isNotNull);
      expect(
          crag.center,
          equals(
            const models.LatLng(32.85052, -117.02223),
          ));
      expect(crag.areas, hasLength(4));
    });
  });
}
