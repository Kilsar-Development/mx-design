import "dart:ui";

import "package:flutter/material.dart";

import "../../../utilities/constants.dart";
import "../../theme/app_theme.dart";
import "../utilities.dart";
import "dialog_contents_mixin.dart";

class DialogOverlay extends StatefulWidget {
  const DialogOverlay({
    required this.child,
    required this.isShown,
    this.body,
    this.onClose,
    super.key,
  });

  final Widget child;
  final bool isShown;
  final Widget? body;
  final Function()? onClose;

  @override
  State<DialogOverlay> createState() => _DialogOverlayState();
}

class _DialogOverlayState extends State<DialogOverlay> {
  @override
  Widget build(BuildContext context) {
    Size? size;
    String title = "";
    IconData? icon;
    double? contentInset;

    if (widget.body is DialogContents) {
      final DialogContents dialogContents = widget.body! as DialogContents;
      size = dialogContents.size;
      title = dialogContents.title;
      icon = dialogContents.icon;
      contentInset = dialogContents.contentInset;

      dialogContents.update = () {
        setState(() {});
      };
    }

    return Stack(
      fit: StackFit.expand,
      children: <Widget>[
        widget.child,
        if (widget.isShown)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onClose,
            onPanStart: (_) {},
            onPanUpdate: (_) {},
            onPanEnd: (_) {},
            child: ClipRRect(
              borderRadius: smBorderRadiusAll,
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 4.0, sigmaY: 4.0),
                child: Opacity(
                  opacity: 0.8,
                  child: ColoredBox(color: context.colorScheme.surface),
                ),
              ),
            ),
          ),
        if (widget.isShown)
          Center(
            child: AnimatedContainer(
              duration: fadeAnimationDuration,
              width: size?.width,
              height: size?.height,
              decoration: BoxDecoration(
                color: context.colorScheme.surface,
                borderRadius: smBorderRadiusAll,
                boxShadow: dropShadow(context),
              ),
              child: Material(
                color: Colors.transparent,
                child: Column(
                  children: <Widget>[
                    const SizedBox(height: Sizing.med),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Flexible(
                            child: Row(
                              children: <Widget>[
                                if (icon != null)
                                  Padding(
                                    padding: const EdgeInsets.only(right: Sizing.small),
                                    child: Icon(
                                      icon,
                                      color: context.colorScheme.primary,
                                    ),
                                  ),
                                Flexible(
                                  child: Text(
                                    title,
                                    style: context.textTheme.subtitleSmall.copyWith(
                                      color: context.colorScheme.onSurface,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (widget.onClose != null)
                            GestureDetector(
                              onTap: widget.onClose,
                              child: Icon(
                                Icons.close,
                                color: context.colorScheme.onSurface,
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: Sizing.small),
                    Divider(color: context.colorScheme.tertiary, height: 1),
                    if (widget.body != null)
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.all(contentInset ?? Sizing.med),
                          child: widget.body,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
