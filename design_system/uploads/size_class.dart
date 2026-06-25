import "package:flutter/foundation.dart";
import "package:flutter/material.dart";

enum SizeClass { desktopXL, desktop, tablet, mobile }

extension SizeClassExt on BuildContext {
  SizeClass get sizeClass {
    final double width = MediaQuery.sizeOf(this).width;
    if (kIsWeb) {
      return width >= 1921 ? SizeClass.desktopXL : SizeClass.desktop;
    }

    return width >= 1184 ? SizeClass.tablet : SizeClass.mobile;
  }
}
