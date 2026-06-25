// loading_overlay.dart
import "dart:ui";

import "package:flutter/material.dart";

import "../../../utilities/utilities.dart";
import "../../theme/app_theme.dart";

// Adapted from: https://dartling.dev/displaying-a-loading-overlay-or-progress-hud-in-flutter
class LoadingOverlay extends StatefulWidget {
  const LoadingOverlay({
    super.key,
    required this.child,
    this.progressStream,
  });

  final Widget? child;
  final Stream<int>? progressStream;

  static LoadingOverlayState of(BuildContext context) {
    return context.findAncestorStateOfType<LoadingOverlayState>()!;
  }

  @override
  State<LoadingOverlay> createState() => LoadingOverlayState();
}

class LoadingOverlayState extends State<LoadingOverlay> {
  bool _isLoading = false;
  int _progress = 0;

  @override
  void initState() {
    super.initState();

    widget.progressStream?.listen((int progress) {
      setState(() => _progress = progress);
    });
  }

  void show() => setState(() => _isLoading = true);

  void hide() => setState(() => _isLoading = false);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height,
      child: Stack(
        children: <Widget>[
          widget.child ?? const SizedBox(),
          if (_isLoading)
            BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 4.0, sigmaY: 4.0),
              child: Opacity(
                opacity: 0.8,
                child: ModalBarrier(
                  dismissible: false,
                  color: context.colorScheme.primaryContainer,
                ),
              ),
            ),
          if (_isLoading)
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  CircularProgressIndicator(
                    color: context.colorScheme.secondaryFixed,
                  ),
                  if (widget.progressStream != null)
                    Padding(
                      padding: const EdgeInsets.only(top: Sizing.med),
                      child: Text("$_progress%", style: context.textTheme.labelLargeBold),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
