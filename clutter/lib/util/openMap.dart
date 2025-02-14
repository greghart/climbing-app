import 'dart:io';

import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

Future<void> openMap(LatLng c) async {
  final googleUri =
      Uri.parse("google.navigation:q=${c.latitude},${c.longitude}&mode=d");
  final appleUri =
      Uri.parse('https://maps.apple.com/?q=${c.latitude},${c.longitude}');

  if (Platform.isAndroid) {
    if (await canLaunchUrl(googleUri)) {
      await launchUrl(googleUri);
    }
  } else {
    if (await canLaunchUrl(appleUri)) {
      await launchUrl(appleUri);
    } else if (await canLaunchUrl(googleUri)) {
      await launchUrl(googleUri);
    }
  }
  launchUrl(
    Uri.parse(
        "https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}"),
    mode: LaunchMode.externalApplication,
  );
}
