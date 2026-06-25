import "package:flutter/foundation.dart";
import "package:flutter/material.dart";

import "../theme/app_theme.dart";

class CircleButton extends StatelessWidget {
  const CircleButton({
    this.size = kIsWeb ? 32 : 48,
    this.color,
    this.borderColor,
    this.icon,
    this.iconSize,
    this.image,
    this.surfaceColor,
    this.isDisabled = false,
    this.package,
    this.iconWidget,
    this.iconWidgetSize,
    this.onPressed,
    this.onTapUp,
    this.tooltip = "",
    this.borderRadius,
    super.key,
  }) : assert(icon != null || image != null, "Either icon or image must be provided");

  final double size;
  final Color? color;
  final Color? borderColor;
  final IconData? icon;
  final double? iconSize;
  final String? image;
  final Color? surfaceColor;
  final bool isDisabled;
  final String? package;
  final String tooltip;
  final Widget? iconWidget;
  final double? iconWidgetSize;
  final BorderRadius? borderRadius;
  final Function()? onPressed;
  final Function(Offset)? onTapUp;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: isDisabled ? SystemMouseCursors.forbidden : SystemMouseCursors.click,
      child: GestureDetector(
        onTapUp: (TapUpDetails details) {
          if (isDisabled) {
            return;
          }

          onPressed != null ? onPressed?.call() : onTapUp?.call(details.globalPosition);
        },
        child: Tooltip(
          message: tooltip,
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  color: color ?? context.colorScheme.surface,
                  borderRadius: borderRadius ?? BorderRadius.circular(size / 2),
                  border: Border.all(color: borderColor ?? context.theme.colorScheme.outline),
                ),
                child: Center(
                  child: icon != null
                      ? Icon(
                          icon,
                          color: (surfaceColor ?? context.theme.colorScheme.onSurface).withValues(
                            alpha: isDisabled ? 0.1 : 1,
                          ),
                          size: iconSize ?? size / 2,
                        )
                      : Image.asset(
                          image!,
                          package: package,
                          width: iconSize ?? size / 2,
                          height: iconSize ?? size / 2,
                          color: (surfaceColor ?? context.theme.colorScheme.onSurface).withValues(
                            alpha: isDisabled ? 0.1 : 1,
                          ),
                        ),
                ),
              ),
              if (iconWidget != null)
                Positioned(
                  top: -((iconWidgetSize ?? 0) / 4),
                  right: -((iconWidgetSize ?? 0) / 4),
                  child: iconWidget!,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
