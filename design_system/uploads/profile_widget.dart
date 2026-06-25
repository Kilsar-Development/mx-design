import "package:flutter/material.dart";

import "../../../models/user.dart";
import "../../../utilities/constants.dart";
import "../../theme/app_theme.dart";
import "../utilities.dart";

class ProfileWidget extends StatelessWidget {
  const ProfileWidget(
      {this.user,
      this.radius = 24,
      this.showAvailability = false,
      this.isAvailable = false,
      this.isSystem = false,
      this.isAssistant = false,
      this.initialsStyle,
      super.key});

  final User? user;
  final double radius;
  final bool showAvailability;
  final bool isAvailable;
  final bool isSystem;
  final bool isAssistant;
  final TextStyle? initialsStyle;

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Container(
          clipBehavior: Clip.hardEdge,
          width: radius * 2,
          height: radius * 2,
          decoration: BoxDecoration(
            color: context.colorScheme.secondaryFixed,
            borderRadius: BorderRadius.circular(radius),
          ),
          child: user?.profilePicture != null
              ? CircleAvatar(
                  radius: radius,
                  backgroundColor: context.colorScheme.secondaryFixed,
                  child: Image.network(
                    fit: BoxFit.fill,
                    width: radius * 2,
                    height: radius * 2,
                    user!.profilePicture!,
                    errorBuilder: errorImageBuilder(color: context.colorScheme.primary, size: (radius * 2) - 6),
                  ),
                )
              : Center(
                  child: isSystem || isAssistant
                      ? Image.asset(
                          isSystem ? "lib/assets/images/logo.png" : "lib/assets/images/orionLogo.png",
                          package: packageName,
                          width: 20,
                          height: 20,
                          color: context.colorScheme.primary,
                        )
                      : Text(
                          user?.initials ?? "?",
                          style: initialsStyle ?? context.textTheme.h5,
                        ),
                ),
        ),
        if (showAvailability)
          Positioned(
            top: -4,
            right: -4,
            child: Icon(isAvailable ? Icons.check : Icons.nightlight_outlined,
                color: isAvailable ? context.accentColors.accent6! : context.colorScheme.tertiaryFixed, size: 18),
          ),
      ],
    );
  }
}
