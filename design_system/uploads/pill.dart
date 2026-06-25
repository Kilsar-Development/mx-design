import "package:flutter/material.dart";
import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class Pill extends StatelessWidget {
  const Pill({
    required this.label,
    required this.backgroundColor,
    required this.textColor,
    this.borderRadius,
    this.padding,
    this.textStyle,
    this.tooltip,
    super.key,
  });

  final String label;
  final Color backgroundColor;
  final Color textColor;
  final BorderRadius? borderRadius;
  final EdgeInsets? padding;
  final TextStyle? textStyle;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip ?? "",
      child: Container(
        padding: padding ?? const EdgeInsets.symmetric(horizontal: Sizing.small, vertical: Sizing.tiny),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: borderRadius ?? smBorderRadiusAll,
        ),
        child: Text(
          label,
          style: textStyle ?? context.textTheme.labelMediumMedium.copyWith(color: textColor),
        ),
      ),
    );
  }
}
