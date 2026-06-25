import "package:flutter/material.dart";

import "../../utilities/constants.dart";
import "../theme/app_theme.dart";

class CompoundSwitch extends StatefulWidget {
  const CompoundSwitch({
    this.assets,
    this.icons,
    this.labels,
    this.iconWidth = 40,
    this.labelWidth,
    this.height = 40,
    this.tooltips,
    this.initialSelection = 0,
    required this.onChange,
    super.key,
  }) : assert(assets != null || icons != null || labels != null, "Either labels, assets or icons must be provided");

  final List<String>? assets;
  final List<IconData>? icons;
  final List<String>? labels;
  final double iconWidth;
  final double? labelWidth;
  final double height;
  final List<String>? tooltips;
  final int initialSelection;
  final Function(int) onChange;

  @override
  State<CompoundSwitch> createState() => _CompoundSwitchState();
}

enum _SwitchType { asset, icon, label }

class _CompoundSwitchState extends State<CompoundSwitch> {
  late final _SwitchType _switchType;

  final double _margin = 2;
  final double _interItemSpacing = 4;

  double? _width;
  late double _labelWidth = 0;

  int _selectedOption = 0;

  @override
  void initState() {
    if (widget.assets != null) {
      _switchType = _SwitchType.asset;
      _width = widget.assets!.length * widget.iconWidth + 2 * _margin + (widget.assets!.length - 1) * _interItemSpacing;
      _labelWidth = widget.iconWidth;
    } else if (widget.icons != null) {
      _switchType = _SwitchType.icon;
      _width = widget.icons!.length * widget.iconWidth + 2 * _margin + (widget.icons!.length - 1) * _interItemSpacing;
    } else {
      _switchType = _SwitchType.label;
      if (widget.labelWidth != null) {
        _width =
            widget.labels!.length * widget.labelWidth! + 2 * _margin + (widget.labels!.length - 1) * _interItemSpacing;
      }
    }

    _selectedOption = widget.initialSelection;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = _width ?? constraints.maxWidth;
        if (_switchType == _SwitchType.label) {
          _labelWidth =
              widget.labelWidth ??
              (width - 2 * _margin - (widget.labels!.length - 1) * _interItemSpacing) / widget.labels!.length;
        }

        return SizedBox(
          height: widget.height,
          child: Stack(
            fit: _width == null ? StackFit.expand : StackFit.loose,
            children: <Widget>[
              Container(
                width: width,
                height: widget.height,
                decoration: BoxDecoration(
                  borderRadius: smBorderRadiusAll,
                  color: context.colorScheme.tertiary,
                  border: Border.all(color: context.colorScheme.outlineVariant),
                ),
              ),
              ..._backgroundItems(),
              _tile(),
            ],
          ),
        );
      },
    );
  }

  Widget _tile() {
    final double entryWidth = _switchType == _SwitchType.label ? _labelWidth : widget.iconWidth;

    return AnimatedPositioned(
      top: 2,
      left: 2 + _selectedOption * (entryWidth + _interItemSpacing),
      duration: fadeAnimationDuration,
      child: Tooltip(
        message: widget.tooltips?[_selectedOption] ?? "",
        child: Container(
          height: widget.height - 2 * _margin,
          width: entryWidth,
          decoration: BoxDecoration(
            borderRadius: smBorderRadiusAll,
            color: context.colorScheme.surface,
          ),
          child: Center(
            child: AnimatedSwitcher(
              duration: fadeAnimationDuration,
              transitionBuilder: (Widget child, Animation<double> animation) {
                return FadeTransition(
                  opacity: animation,
                  child: child,
                );
              },
              child: switch (_switchType) {
                _SwitchType.asset => Image.asset(
                  widget.assets![_selectedOption],
                  package: packageName,
                  color: context.colorScheme.onSurface,
                  width: 20,
                  key: ValueKey<int>(_selectedOption),
                ),
                _SwitchType.icon => Icon(
                  widget.icons![_selectedOption],
                  color: context.colorScheme.onSurface,
                  size: 20,
                  key: ValueKey<int>(_selectedOption),
                ),
                _SwitchType.label => Text(
                  widget.labels![_selectedOption],
                  style: context.textTheme.labelMediumSemiBold,
                ),
              },
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _backgroundItems() {
    final List<Widget> items = <Widget>[];

    switch (_switchType) {
      case _SwitchType.asset:
        widget.assets!.asMap().entries.forEach((MapEntry<int, String> entry) {
          items.add(
            Positioned(
              top: 2,
              left: 2 + entry.key * (widget.iconWidth + _interItemSpacing),
              child: InkWell(
                onTap: () => setState(() {
                  _selectedOption = entry.key;
                  widget.onChange(_selectedOption);
                }),
                child: Tooltip(
                  message: widget.tooltips?[entry.key] ?? "",
                  child: SizedBox(
                    height: widget.height - 2 * _margin,
                    width: widget.iconWidth,
                    child: Center(
                      child: Image.asset(
                        widget.assets![entry.key],
                        package: packageName,
                        color: context.colorScheme.onTertiary,
                        width: 20,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        });
      case _SwitchType.icon:
        widget.icons!.asMap().entries.forEach((MapEntry<int, IconData> entry) {
          items.add(
            Positioned(
              top: 2,
              left: 2 + entry.key * (widget.iconWidth + _interItemSpacing),
              child: InkWell(
                onTap: () => setState(() {
                  _selectedOption = entry.key;
                  widget.onChange(_selectedOption);
                }),
                child: Tooltip(
                  message: widget.tooltips?[entry.key] ?? "",
                  child: SizedBox(
                    height: widget.height - 2 * _margin,
                    width: widget.iconWidth,
                    child: Center(
                      child: Icon(
                        widget.icons![entry.key],
                        color: context.colorScheme.onTertiary,
                        size: 20,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        });
      case _SwitchType.label:
        widget.labels!.asMap().entries.forEach((MapEntry<int, String> entry) {
          items.add(
            Positioned(
              top: 2,
              left: 2 + entry.key * (_labelWidth + _interItemSpacing),
              child: InkWell(
                onTap: () => setState(() {
                  _selectedOption = entry.key;
                  widget.onChange(_selectedOption);
                }),
                child: Tooltip(
                  message: widget.tooltips?[entry.key] ?? "",
                  child: SizedBox(
                    height: widget.height - 2 * _margin,
                    width: _labelWidth,
                    child: Center(
                      child: Text(
                        widget.labels![entry.key],
                        style: context.textTheme.labelMediumSemiBold.copyWith(color: context.colorScheme.onTertiary),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        });
    }

    return items;
  }
}
