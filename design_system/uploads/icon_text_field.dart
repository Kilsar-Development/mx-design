import "package:flutter/material.dart";
import "package:flutter/services.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";
import "decorated_text_field.dart";

// ignore: must_be_immutable
class IconTextField extends StatefulWidget with DecoratedTextField {
  IconTextField({
    this.icon,
    this.asset,
    this.leadingWidget,
    String hintText = "",
    required TextEditingController controller,
    bool isError = false,
    FocusNode? focusNode,
    this.onSubmit,
    TextInputType inputType = TextInputType.text,
    bool isSecure = false,
    this.maxLines,
    this.height = 48,
    this.width,
    this.textAlignVertical = TextAlignVertical.center,
    this.textStyle,
    this.textAlign = TextAlign.start,
    List<TextInputFormatter>? inputFormatters,
    this.contentPadding,
    this.borderRadius = smallBorderRadius,
    this.bottomPadding = 0,
    this.backgroundColor,
    this.showBorder = true,
    this.readOnly = false,
    this.readOnlyOnTap,
    this.textColor,
    this.autocorrect = true,
    super.key,
  }) : _focus = focusNode ?? FocusNode(),
       inputFormatters = inputFormatters ?? <TextInputFormatter>[] {
    this.hintText = hintText;
    this.controller = controller;
    this.isError = isError;
    this.isSecure = isSecure;
    this.inputType = inputType;
  }

  final IconData? icon;
  final String? asset;
  final Widget? leadingWidget;
  final FocusNode _focus;
  final Function(String)? onSubmit;
  final int? maxLines;
  final double height;
  final double? width;
  final TextAlignVertical textAlignVertical;
  final TextStyle? textStyle;
  final TextAlign textAlign;
  final List<TextInputFormatter> inputFormatters;
  final EdgeInsetsGeometry? contentPadding;
  final double borderRadius;
  final double bottomPadding;
  final Color? backgroundColor;
  final bool showBorder;
  final bool readOnly;
  final Function()? readOnlyOnTap;
  final Color? textColor;
  final bool autocorrect;

  @override
  State<IconTextField> createState() => _IconTextFieldState();
}

class _IconTextFieldState extends State<IconTextField> with TickerProviderStateMixin {
  final GlobalKey _containerKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    final Widget? leadingWidget = _leadingWidget();

    return InkWell(
      onTap: () {
        if (widget.readOnly || widget.readOnlyOnTap != null) return;

        widget._focus.requestFocus();
      },
      child: ClipRRect(
        clipBehavior: Clip.hardEdge,
        borderRadius: BorderRadius.circular(widget.borderRadius),
        child: SizedBox(
          height: widget.height,
          width: widget.width,
          key: _containerKey,
          child: TextField(
            onTap: () {
              widget.readOnlyOnTap?.call();

              if (widget.readOnly || widget.readOnlyOnTap != null) {
                widget._focus.unfocus();
              }
            },
            autocorrect: false,
            readOnly: widget.readOnly || widget.readOnlyOnTap != null,
            keyboardType: widget.inputType,
            inputFormatters: widget.inputFormatters,
            textAlign: widget.textAlign,
            style: (widget.textStyle ?? context.textTheme.labelLarge).copyWith(
              color: widget.textColor ?? context.colorScheme.onSurface,
            ),
            obscureText: widget.isSecure,
            onSubmitted: widget.onSubmit,
            controller: widget.controller,
            focusNode: widget._focus,
            maxLines: widget.isSecure ? 1 : widget.maxLines,
            expands: !widget.isSecure && widget.maxLines == null,
            textAlignVertical: widget.textAlignVertical,
            decoration: InputDecoration(
              isCollapsed: false,
              filled: true,
              fillColor: widget.backgroundColor ?? context.colorScheme.surface,
              contentPadding: widget.contentPadding ?? const EdgeInsets.all(Sizing.small),
              prefixIcon: leadingWidget,
              hintText: widget.hintText,
              hintStyle: context.textTheme.labelLarge.copyWith(color: context.colorScheme.onSurfaceVariant),
              focusedBorder: widget.showBorder
                  ? OutlineInputBorder(
                      borderSide: widget.isError
                          ? BorderSide(color: context.colorScheme.error)
                          : BorderSide(color: context.colorScheme.outlineVariant),
                      borderRadius: BorderRadius.circular(widget.borderRadius),
                    )
                  : InputBorder.none,
              enabledBorder: OutlineInputBorder(
                borderSide: widget.showBorder
                    ? widget.isError
                          ? BorderSide(color: context.colorScheme.error)
                          : BorderSide(color: context.colorScheme.outlineVariant)
                    : BorderSide.none,
                borderRadius: BorderRadius.circular(widget.borderRadius),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget? _leadingWidget() {
    if (widget.leadingWidget != null) {
      return widget.leadingWidget!;
    }

    if (widget.icon != null) {
      return Padding(
        padding: const EdgeInsets.only(left: Sizing.small),
        child: Icon(
          widget.icon,
          color: context.colorScheme.onSurface,
        ),
      );
    }
    if (widget.asset != null) {
      return Padding(
        padding: const EdgeInsets.only(
          right: Sizing.xSmall,
          left: Sizing.small,
        ),
        child: Image.asset(
          widget.asset!,
          package: packageName,
          color: context.colorScheme.onSurface,
          width: 24,
          height: 24,
        ),
      );
    }

    return null;
  }
}
