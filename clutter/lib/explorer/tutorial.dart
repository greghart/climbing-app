import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tutorial_coach_mark/tutorial_coach_mark.dart';

import '../settings/settings_controller.dart';

// Declare unique keys for our tutorial targets
final explorerSearchBarKey = LabeledGlobalKey('explorer_search_bar');
final explorerSearchBarHamburgerKey =
    LabeledGlobalKey('explorer_search_bar_hamburger');
final explorerSearchBarLayersKey =
    LabeledGlobalKey('explorer_search_bar_layers');
final explorerOverlayKey = LabeledGlobalKey('explorer_overlay');

class Tutorial extends StatefulWidget {
  const Tutorial({super.key});

  @override
  State<Tutorial> createState() => _TutorialState();
}

class _TutorialState extends State<Tutorial> {
  @override
  void initState() {
    super.initState();
    if (context.read<SettingsController>().explorerTutorial) {
      Future.delayed(Duration.zero, showTutorial);
    }
  }

  @override
  Widget build(BuildContext context) {
    return const SizedBox.shrink();
  }

  void showTutorial() {
    final theme = Theme.of(context);
    final screenSize = MediaQuery.of(context).size;
    final targets = [
      MyTargetFocus(
        identify: "Welcome",
        keyTarget: explorerSearchBarKey,
        title: "Welcome to Boulder Buddy Santee",
        description: """
This is an open source app to help explore the boulders of Santee. Split up into areas, boulders, and routes, we hope you'll find this a useful tool to guide your next sesh. 

This tutorial will guide you through the app, but feel free to skip. You can always reset this tutorial in the settings.
""",
      ),
      MyTargetFocus(
        identify: "Search",
        keyTarget: explorerSearchBarKey,
        title: "Search Bar",
        description: "Search for crags, areas, or routes",
      ),
      MyTargetFocus(
        identify: "Settings",
        keyTarget: explorerSearchBarHamburgerKey,
        title: "Settings",
        description: "Open the navigation menu, change settings",
      ),
      MyTargetFocus(
        identify: "Layers",
        keyTarget: explorerSearchBarLayersKey,
        title: "Layers",
        description: "Change the map layers to decide what shows up on screen",
      ),
      MyTargetFocus(
        identify: "Sun arrow",
        targetPosition: TargetPosition(
          const Size(50, 50),
          Offset(
            screenSize.width / 2 - 25,
            screenSize.height / 2 - 25,
          ),
        ),
        title: "Sun arrow",
        description:
            "The sun arrow displays the azimuth (direction of the sun along the horizon), and its' altitude (angle above horizon) is represented by how filled the length is",
      ),
      MyTargetFocus(
        identify: "Overlay",
        keyTarget: explorerOverlayKey,
        title: "Overlay",
        description:
            "Drag up the overlay to see details about your currently selected crag, area, boulder, or route.",
        align: ContentAlign.top,
      ),
    ]; // List<TargetFocus>
    int steps = 0;
    TutorialCoachMark? tutorial;
    tutorial = TutorialCoachMark(
      colorShadow: theme.colorScheme.primaryContainer,
      focusAnimationDuration: Duration.zero,
      unFocusAnimationDuration: Duration.zero,
      pulseEnable: false,
      textSkip: "SKIP TUTORIAL",
      textStyleSkip: TextStyle(
        color: theme.colorScheme.onPrimaryContainer,
      ),
      paddingFocus: 0,
      // alignSkip: Alignment.bottomRight,
      // textSkip: "SKIP",
      // paddingFocus: 10,
      // focusAnimationDuration: Duration(milliseconds: 500),
      // unFocusAnimationDuration: Duration(milliseconds: 500),
      // pulseAnimationDuration: Duration(milliseconds: 500),
      // pulseVariation: Tween(begin: 1.0, end: 0.99),
      // showSkipInLastTarget: true,
      // imageFilter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
      // initialFocus: 0,
      // useSafeArea: true,
      onFinish: () {
        print("onFinish");
        context.read<SettingsController>().updateExplorerTutorial(false);
      },
      onClickOverlay: (target) {
        print("onClickOverlay");
        steps += 1;
        if (steps == targets.length) {
          tutorial!.finish();
        }
      },
      onSkip: () {
        print("onSkip");
        tutorial!.finish();
        return false;
      },
      targets: targets,
    )..show(context: context);

    // tutorial.skip();
    // tutorial.finish();
    // tutorial.next(); // call next target programmatically
    // tutorial.previous(); // call previous target programmatically
    // tutorial.goTo(3); // call target programmatically by index
  }
}

class TutorialEntry extends StatelessWidget {
  const TutorialEntry({
    super.key,
    required this.title,
    required this.description,
  });
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onPrimaryContainer,
            fontSize: 20.0,
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 10.0),
          child: Text(
            description,
            style: TextStyle(
              color: theme.colorScheme.onPrimaryContainer,
            ),
          ),
        )
      ],
    );
  }
}

class MyTargetFocus extends TargetFocus {
  MyTargetFocus({
    required super.identify,
    super.keyTarget,
    super.targetPosition,
    super.enableOverlayTab = true,
    super.shape = ShapeLightFocus.RRect,
    super.alignSkip = Alignment.bottomRight,
    // Either provide title, desc, alignment, or contents manually
    this.title = "TITLE",
    this.description = "DESCRIPTION",
    this.align = ContentAlign.bottom,
    List<TargetContent>? contents,
  }) : super(
          contents: contents ??
              [
                TargetContent(
                  align: align,
                  child: TutorialEntry(
                    title: title,
                    description: description,
                  ),
                )
              ],
        );

  final String title;
  final String description;
  final ContentAlign align;
}
