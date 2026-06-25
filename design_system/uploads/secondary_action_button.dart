import "package:flutter/foundation.dart";
import "package:flutter/material.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class SecondaryActionButton extends StatelessWidget {
  const SecondaryActionButton({
    required this.title,
    this.onPressed,
    this.height = 40,
    this.isDisabled = false,
    this.icon,
    this.iconColor,
    this.width,
    super.key,
  });

  final String title;
  final Function()? onPressed;
  final double height;
  final bool isDisabled;
  final IconData? icon;
  final Color? iconColor;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        if (isDisabled) {
          return;
        }
        onPressed?.call();
      },
      child: Container(
        height: height,
        width: width,
        alignment: Alignment.center,
        padding: EdgeInsets.only(left: icon == null ? Sizing.med : Sizing.small, right: Sizing.med),
        decoration: BoxDecoration(
          color: context.colorScheme.surface,
          borderRadius: kIsWeb ? smBorderRadiusAll : medBorderRadiusAll,
          border: Border.all(color: context.colorScheme.outlineVariant),
        ),
        child: icon != null
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.only(right: Sizing.xSmall),
                    child: Icon(
                      icon,
                      size: 20,
                      color: isDisabled
                          ? context.colorScheme.onSurfaceVariant
                          : iconColor ?? context.colorScheme.onSurface,
                    ),
                  ),
                  Text(
                    title,
                    style: context.textTheme.labelLargeBold.copyWith(
                      color: isDisabled ? context.colorScheme.onSurfaceVariant : context.colorScheme.onSurface,
                    ),
                  ),
                ],
              )
            : Text(
                title,
                style: context.textTheme.labelLargeBold.copyWith(
                  color: isDisabled ? context.colorScheme.onSurfaceVariant : context.colorScheme.onSurface,
                ),
              ),
      ),
    );
  }
}
