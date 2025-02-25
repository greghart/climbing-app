import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A service that stores and retrieves user settings.
///
/// By default, this class does not persist user settings. If you'd like to
/// persist the user settings locally, use the shared_preferences package. If
/// you'd like to store settings on a web server, use the http package.
class SettingsService {
  final SharedPreferencesAsync prefs = SharedPreferencesAsync();

  /// Loads the User's preferred ThemeMode from local or remote storage.
  Future<ThemeMode> themeMode() async => ThemeMode.values
      .byName(await prefs.getString("themeMode") ?? ThemeMode.dark.name);

  /// Persists the user's preferred ThemeMode to local or remote storage.
  Future<void> updateThemeMode(ThemeMode theme) async =>
      await prefs.setString("themeMode", theme.name);

  Future<bool> cozyCompass() async =>
      await prefs.getBool("cozyCompass") ?? false;

  Future<void> updateCozyCompass(bool b) async =>
      await prefs.setBool("cozyCompass", b);

  Future<bool> fullSizeImages() async =>
      await prefs.getBool("fullSizeImages") ?? false;

  Future<void> updateFullSizeImages(bool b) async =>
      await prefs.setBool("fullSizeImages", b);

  Future<bool> explorerTutorial() async =>
      await prefs.getBool("explorerTutorial") ?? true;

  Future<void> updateExplorerTutorial(bool b) async =>
      await prefs.setBool("explorerTutorial", b);
}
