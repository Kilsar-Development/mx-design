import "package:flutter/material.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class AlertAction {
  AlertAction({required this.label, required this.onPressed, this.isDestructive = false, this.isDisabled = false});

  final String label;
  final Function() onPressed;
  final bool isDestructive;
  final bool isDisabled;
}

class AlertPrompt extends StatelessWidget {
  const AlertPrompt({required this.title, this.message, required this.actions, this.body, super.key});

  final String title;
  final String? message;
  final List<AlertAction> actions;
  final Widget? body;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: context.colorScheme.surface,
      title: Text(
        title,
        style: context.textTheme.h4.copyWith(color: context.colorScheme.onSecondary),
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (message != null)
            Text(
              message!,
              style: context.textTheme.labelLarge.copyWith(color: context.colorScheme.onSecondary),
            ),
          body ?? Container(),
        ],
      ),
      shape: const RoundedRectangleBorder(borderRadius: smBorderRadiusAll),
      actions: actions.map((AlertAction action) {
        return TextButton(
          onPressed: action.isDisabled ? null : action.onPressed,
          child: Text(
            action.label,
            style: context.textTheme.labelLargeBold.copyWith(
              color: action.isDisabled
                  ? context.colorScheme.onSurfaceVariant
                  : (action.isDestructive ? context.colorScheme.error : context.colorScheme.onSecondary),
            ),
          ),
        );
      }).toList(),
    );
  }
}


/** <Widget>[
        TextButton(
          child: const Text("Cancel"),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text(
            "Yes, Unlink it!",
            style: context.textTheme.labelLarge.copyWith(color: context.colorScheme.error),
          ),
          onPressed: () {
            Navigator.of(context).pop();
            setState(() {
              widget.step.removeLinkedItem(_pendingUnlink);
            });
          },
        ),
      ], */
