import "package:flutter/material.dart";
import "package:flutter_bloc/flutter_bloc.dart";
import "package:kilsar_core/kilsar_core.dart";
import "package:pointer_interceptor/pointer_interceptor.dart";

import "../../../utilities/utilities.dart";
import "../../theme/app_theme.dart";
import "../utilities.dart";
import "cubit/drawer_cubit.dart";
import "dialog_overlay.dart";
import "loading_overlay.dart";

class DrawerOverlay extends StatefulWidget {
  const DrawerOverlay({
    required this.child,
    super.key,
  });

  final Widget child;
  static const double COLLAPSED_WIDTH = 426;
  // ignore: non_constant_identifier_names
  static double WIDE_WIDTH(BuildContext context) => MediaQuery.sizeOf(context).width * 0.5;

  @override
  State<DrawerOverlay> createState() => _DrawerOverlayState();
}

class _DrawerOverlayState extends State<DrawerOverlay> with SingleTickerProviderStateMixin {
  final DrawerCubit _drawerCubit = locator<DrawerCubit>();

  bool _rightDrawerOpen = false;
  DrawerSize _rightDrawerSize = DrawerSize.normal;
  Widget? _rightContents;
  bool _rightIsExpanded = false;

  bool _leftDrawerOpen = false;
  DrawerSize _leftDrawerSize = DrawerSize.normal;
  Widget? _leftContents;
  bool _leftIsExpanded = false;

  bool _dialogIsShown = false;
  Widget? _dialogContents;

  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.sizeOf(context);
    final double drawerHeight = screenSize.height - 2 * Sizing.small;

    return SizedBox(
      width: screenSize.width,
      height: screenSize.height,
      child: BlocProvider<DrawerCubit>.value(
        value: _drawerCubit,
        child: BlocListener<DrawerCubit, DrawerState>(
          listener: (BuildContext context, DrawerState state) {
            switch (state) {
              case RightDrawerClosed _:
                setState(() {
                  _rightDrawerOpen = false;
                  _rightIsExpanded = false;
                  _rightContents = null;
                });
              case RightDrawerShown _:
                setState(() {
                  _rightDrawerSize = state.size;
                  _rightContents = state.contents;
                  _rightDrawerOpen = true;
                });

              case RightToggleExpanded _:
                setState(() {
                  _rightIsExpanded = !_rightIsExpanded;
                  if (_rightIsExpanded) {
                    _leftIsExpanded = false;
                    _leftDrawerOpen = false;
                  }
                });
              case LeftDrawerClosed _:
                setState(() {
                  _leftDrawerOpen = false;
                  _leftIsExpanded = false;
                  _leftContents = null;
                });
              case LeftDrawerShown _:
                setState(() {
                  _leftDrawerSize = state.size;
                  _leftContents = state.contents;
                  _leftDrawerOpen = true;
                });
              case LeftToggleExpanded _:
                setState(() {
                  _leftIsExpanded = !_leftIsExpanded;
                  if (_leftIsExpanded) {
                    _rightIsExpanded = false;
                    _rightDrawerOpen = false;
                  }
                });
              case DialogClosed _:
                setState(() {
                  _dialogContents = null;
                  _dialogIsShown = false;
                });
              case DialogShown _:
                setState(() {
                  _dialogContents = state.dialog;
                  _dialogIsShown = true;
                });
              default:
            }
          },
          child: LoadingOverlay(
            child: DialogOverlay(
              isShown: _dialogIsShown,
              body: _dialogContents,
              onClose: () => _drawerCubit.hideDialog(),
              child: Stack(
                children: <Widget>[
                  widget.child,
                  _tapDetectionOverlay(),
                  AnimatedPositioned(
                    duration: fadeAnimationDuration,
                    curve: Curves.easeInOut,
                    left: _rightDrawerOpen
                        ? _rightIsExpanded
                              ? Sizing.small
                              : _rightDrawerSize == DrawerSize.normal
                              ? screenSize.width - DrawerOverlay.COLLAPSED_WIDTH - Sizing.small
                              : screenSize.width - (screenSize.width * 0.5) - Sizing.small
                        : screenSize.width,
                    top: Sizing.small,
                    right: _rightDrawerOpen
                        ? Sizing.small
                        : -(MediaQuery.sizeOf(context).width + DrawerOverlay.COLLAPSED_WIDTH),
                    bottom: Sizing.small,
                    child: PointerInterceptor(
                      child: AnimatedContainer(
                        duration: fadeAnimationDuration,
                        decoration: BoxDecoration(
                          color: context.colorScheme.surface,
                          borderRadius: smBorderRadiusAll,
                          boxShadow: dropShadow(context),
                        ),
                        width: _rightIsExpanded
                            ? MediaQuery.sizeOf(context).width
                            : _rightDrawerSize == DrawerSize.normal
                            ? DrawerOverlay.COLLAPSED_WIDTH
                            : MediaQuery.sizeOf(context).width * 0.5,
                        height: drawerHeight,
                        child: _rightContents,
                      ),
                    ),
                  ),
                  AnimatedPositioned(
                    duration: fadeAnimationDuration,
                    curve: Curves.easeInOut,
                    right: _leftDrawerOpen
                        ? _leftIsExpanded
                              ? Sizing.small
                              : _leftDrawerSize == DrawerSize.normal
                              ? screenSize.width - DrawerOverlay.COLLAPSED_WIDTH - Sizing.small
                              : screenSize.width - (screenSize.width * 0.5) - Sizing.small
                        : screenSize.width,
                    top: Sizing.small,
                    left: _leftDrawerOpen
                        ? Sizing.small
                        : -(MediaQuery.sizeOf(context).width + DrawerOverlay.COLLAPSED_WIDTH),
                    bottom: Sizing.small,
                    child: PointerInterceptor(
                      child: AnimatedContainer(
                        duration: fadeAnimationDuration,
                        decoration: BoxDecoration(
                          color: context.colorScheme.surface,
                          borderRadius: smBorderRadiusAll,
                          boxShadow: dropShadow(context),
                        ),
                        width: _leftIsExpanded
                            ? MediaQuery.sizeOf(context).width
                            : _leftDrawerSize == DrawerSize.normal
                            ? DrawerOverlay.COLLAPSED_WIDTH
                            : MediaQuery.sizeOf(context).width * 0.5,
                        height: drawerHeight,
                        child: _leftContents,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _tapDetectionOverlay() {
    return IgnorePointer(
      ignoring: !_leftDrawerOpen && !_rightDrawerOpen,
      child: InkWell(
        onTapDown: (_) {
          _drawerCubit.hideRight();
          _drawerCubit.hideLeft();
        },
        child: SizedBox(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
        ),
      ),
    );
  }
}
