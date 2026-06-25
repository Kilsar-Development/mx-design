import "dart:async";

import "package:flutter/material.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class Dropdown<T> extends StatefulWidget {
  const Dropdown({
    required this.items,
    required this.onChanged,
    required this.menuItemBuilder,
    this.backgroundColorBuilder,
    this.selectedItemBuilder,
    this.isError = false,
    this.initialValue,
    this.width,
    this.height = 40,
    this.updateStream,
    this.borderColor,
    this.textColor,
    this.readOnly = false,
    super.key,
  });

  final List<T> items;
  final Function(T?, T?) onChanged;
  final Widget Function(T) menuItemBuilder;
  final Color? Function(T?)? backgroundColorBuilder;
  final List<Widget> Function(BuildContext)? selectedItemBuilder;
  final bool isError;
  final T? initialValue;
  final double? width;
  final double height;
  final Stream<T>? updateStream;
  final Color? borderColor;
  final Color? textColor;
  final bool readOnly;

  @override
  State<Dropdown<T>> createState() => _DropdownState<T>();
}

class _DropdownState<T> extends State<Dropdown<T>> {
  T? _value;
  StreamSubscription<T>? _subscription;

  @override
  void initState() {
    super.initState();

    widget.updateStream?.listen((T? value) {
      if (!mounted) return;

      setState(() {
        _value = value;
      });
    });

    setState(() {
      _value = widget.initialValue;
    });
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color borderColor = widget.borderColor ?? context.colorScheme.outlineVariant;

    return Container(
      height: widget.height,
      width: widget.width,
      padding: const EdgeInsets.only(left: Sizing.small, right: Sizing.xSmall),
      decoration: BoxDecoration(
        color: widget.backgroundColorBuilder != null ? widget.backgroundColorBuilder!(_value) : Colors.transparent,
        borderRadius: smBorderRadiusAll,
        border: Border.all(color: widget.isError ? context.colorScheme.error : borderColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: _value,
          focusColor: Colors.transparent,
          dropdownColor: context.colorScheme.onPrimary,
          borderRadius: smBorderRadiusAll,
          icon: Icon(
            Icons.keyboard_arrow_down_outlined,
            color: widget.textColor,
          ),
          selectedItemBuilder: widget.selectedItemBuilder,
          onChanged: widget.readOnly
              ? null
              : (T? value) {
                  setState(() {
                    final T? prevValue = _value;
                    _value = value;
                    widget.onChanged(value, prevValue);
                  });
                },
          items: widget.items
              .map(
                (T entry) => DropdownMenuItem<T>(
                  value: entry,
                  child: SizedBox(
                    width: widget.width != null ? widget.width! - 44 : null,
                    child: widget.menuItemBuilder(entry),
                  ),
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}
