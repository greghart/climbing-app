import 'package:flutter/material.dart';

import 'settings_service.dart';

/// A class that many Widgets can interact with to read user settings, update
/// user settings, or listen to user settings changes.
///
/// Controllers glue Data Services to Flutter Widgets. The SettingsController
/// uses the SettingsService to store and retrieve user settings.
class SettingsController with ChangeNotifier {
  SettingsController(this._settingsService);

  // Make SettingsService a private variable so it is not used directly.
  final SettingsService _settingsService;

  /// Load the user's settings from the SettingsService. It may load from a
  /// local database or the internet. The controller only knows it can load the
  /// settings from the service.
  Future<void> loadSettings() async {
    _themeMode = await _settingsService.themeMode();
    _cozyCompass = await _settingsService.cozyCompass();
    _fullSizeImages = await _settingsService.fullSizeImages();
    _explorerTutorial = await _settingsService.explorerTutorial();
    print("Set explorer tutorial to $_explorerTutorial");

    // Important! Inform listeners a change has occurred.
    notifyListeners();
  }

  // Whether to use the small cozy compass in breadcrumbs
  late bool _cozyCompass = false;
  bool get cozyCompass => _cozyCompass;
  Future<void> updateCozyCompass(bool? b) async {
    if (b == null || b == _cozyCompass) return;

    _cozyCompass = b;
    notifyListeners();

    await _settingsService.updateCozyCompass(b);
  }

  // Whether to let images expand out of screen (requiring a scroll)
  late bool _fullSizeImages = false;
  bool get fullSizeImages => _fullSizeImages;

  Future<void> updateFullSizeImages(bool? b) async {
    if (b == null || b == _fullSizeImages) return;

    _fullSizeImages = b;
    notifyListeners();

    await _settingsService.updateFullSizeImages(b);
  }

  Future<void> toggleWideImages() async {
    updateFullSizeImages(!_fullSizeImages);
  }

  // Whether to show the explorer tutorial
  late bool _explorerTutorial = true;
  bool get explorerTutorial => _explorerTutorial;
  Future<void> updateExplorerTutorial(bool? b) async {
    if (b == null || b == _explorerTutorial) return;

    _explorerTutorial = b;
    notifyListeners();

    await _settingsService.updateExplorerTutorial(b);
  }

  Future<void> resetTutorials() async {
    await updateExplorerTutorial(true);
  }

  // Allow Widgets to read the user's preferred ThemeMode.
  // @note Make ThemeMode a private variable so it is not updated directly without
  // also persisting the changes with the SettingsService.
  late ThemeMode _themeMode = ThemeMode.dark;
  ThemeMode get themeMode => _themeMode;

  /// Update and persist the ThemeMode based on the user's selection.
  Future<void> updateThemeMode(ThemeMode? newThemeMode) async {
    if (newThemeMode == null) return;

    // Do not perform any work if new and old ThemeMode are identical
    if (newThemeMode == _themeMode) return;

    // Otherwise, store the new ThemeMode in memory
    _themeMode = newThemeMode;

    // Important! Inform listeners a change has occurred.
    notifyListeners();

    // Persist the changes to a local database or the internet using the
    // SettingService.
    await _settingsService.updateThemeMode(newThemeMode);
  }
}
