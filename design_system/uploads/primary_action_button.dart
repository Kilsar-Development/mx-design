import "package:flutter/foundation.dart";
import "package:flutter/material.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class PrimaryActionButton extends StatelessWidget {
  const PrimaryActionButton({
    required this.title,
    this.onPressed,
    this.onTapUp,
    this.height = 40,
    this.isDisabled = false,
    this.color,
    this.textColor,
    this.borderColor,
    this.width,
    this.leadingIcon,
    this.leadingIconColor,
    this.leadingWidget,
    this.trailingIcon,
    this.trailingIconColor,
    this.tooltip,
    super.key,
  });

  final String title;
  final Function()? onPressed;
  final Function(TapUpDetails)? onTapUp;
  final double? height;
  final bool isDisabled;
  final Color? color;
  final Color? textColor;
  final Color? borderColor;
  final double? width;
  final IconData? leadingIcon;
  final Color? leadingIconColor;
  final Widget? leadingWidget;
  final IconData? trailingIcon;
  final Color? trailingIconColor;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        if (isDisabled) return;

        onPressed?.call();
      },
      onTapUp: (TapUpDetails details) {
        if (isDisabled) return;

        onTapUp?.call(details);
      },
      child: Tooltip(
        message: tooltip ?? "",
        child: Container(
          height: height,
          width: width,
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
          decoration: BoxDecoration(
            color: color ?? context.colorScheme.tertiaryContainer,
            borderRadius: kIsWeb ? smBorderRadiusAll : medBorderRadiusAll,
            border: Border.all(color: borderColor ?? Colors.transparent),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (leadingIcon != null)
                Padding(
                  padding: const EdgeInsets.only(right: Sizing.xSmall),
                  child: Icon(
                    leadingIcon,
                    size: 20,
                    color: isDisabled
                        ? context.colorScheme.onSurfaceVariant
                        : leadingIconColor ?? context.colorScheme.onTertiaryContainer,
                  ),
                )
              else if (leadingWidget != null)
                Padding(
                  padding: const EdgeInsets.only(right: Sizing.xSmall),
                  child: leadingWidget,
                ),
              Text(
                title,
                style: context.textTheme.labelLargeBold.copyWith(
                  color: isDisabled
                      ? context.colorScheme.onSurfaceVariant
                      : textColor ?? context.colorScheme.onTertiaryContainer,
                ),
              ),
              if (trailingIcon != null)
                Padding(
                  padding: const EdgeInsets.only(left: Sizing.xSmall),
                  child: Icon(
                    trailingIcon,
                    size: 20,
                    color: isDisabled
                        ? context.colorScheme.onSurfaceVariant
                        : trailingIconColor ?? context.colorScheme.onTertiaryContainer,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
