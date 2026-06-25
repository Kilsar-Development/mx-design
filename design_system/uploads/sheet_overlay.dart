import "package:flutter/material.dart";

import "../../../utilities/constants.dart";
import "../../theme/app_theme.dart";
import "../circle_button.dart";
import "../colored_safe_area.dart";

class SheetOverlay extends StatelessWidget {
  const SheetOverlay({
    this.leadingWidget,
    this.trailingWidgets,
    this.title = "",
    required this.child,
    this.height,
    this.onClose,
    super.key,
  });

  final Widget? leadingWidget;
  final List<Widget>? trailingWidgets;
  final String title;
  final Widget child;
  final double? height;
  final Function()? onClose;

  @override
  Widget build(BuildContext context) {
    final double bottomPadding = MediaQuery.of(context).viewInsets.bottom;

    double? sheetHeight = height;
    if (sheetHeight != null) {
      sheetHeight += bottomPadding;
    }

    return ColoredSafeArea(
      child: Container(
        height: sheetHeight,
        padding: const EdgeInsets.all(Sizing.med),
        child: Column(
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                if (leadingWidget != null || title.isNotEmpty)
                  Row(
                    children: <Widget>[
                      if (leadingWidget != null) ...<Widget>[
                        leadingWidget!,
                        const SizedBox(width: Sizing.small),
                      ],
                      if (title.isNotEmpty) Text(title, style: context.textTheme.h2),
                    ],
                  ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      if (trailingWidgets != null) ...trailingWidgets!,
                      if (trailingWidgets != null) const SizedBox(width: Sizing.small),
                      CircleButton(
                        size: 40,
                        onPressed: () {
                          Navigator.of(context).pop();
                          onClose?.call();
                        },
                        icon: Icons.close,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: Sizing.med),
            Expanded(child: child),
          ],
        ),
      ),
    );
  }
}
