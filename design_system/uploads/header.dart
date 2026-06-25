import "dart:async";

import "package:flutter/material.dart";
import "package:flutter_bloc/flutter_bloc.dart";
import "package:flutter_typeahead/flutter_typeahead.dart";
import "package:kilsar_core/kilsar_core.dart";

import "../../services/AlertService/alert_service.dart";
import "../../services/UserService/user_service.dart";
import "../../services/UserService/user_service_events.dart";
import "../../utilities/constants.dart";
import "../routes/app_router.dart";
import "../screens/Profile/profile_drawer.dart";

import "../theme/app_theme.dart";
import "Overlays/cubit/drawer_cubit.dart";
import "UserWidgets/profile_widget.dart";
import "circle_button.dart";
import "header_cubit.dart";
import "icon_text_field.dart";

class Header extends StatefulWidget {
  const Header({super.key});

  static const double height = 64;

  @override
  State<Header> createState() => HeaderState();
}

class HeaderState extends State<Header> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  TextEditingController? _searchFieldController;

  final int maxSearchHistory = 5;
  final List<String> _searchHistory = <String>[];

  Timer? _shakeTimer;
  final int _shakeLimit = 6;
  int _shakeCount = 0;
  double _bellRotation = 0;
  bool _shouldShake = false;
  bool _isShaking = false;
  int _unreadAlertCount = 0;
  final Duration _timeBetweenShakes = const Duration(seconds: 3);

  bool _showSearchBar = false;
  final FocusNode _searchFocus = FocusNode();

  StreamSubscription<DomainEvent>? _eventBusSubscription;

  @override
  void initState() {
    super.initState();

    _searchController.addListener(() {
      locator<HeaderCubit>().updateSearch(_searchController.text);
    });

    _unreadAlertCount = locator<AlertService>().unreadCount;
    if (_unreadAlertCount > 0) {
      _startShake();

      _shakeTimer = Timer.periodic(_timeBetweenShakes, (Timer timer) {
        _startShake();
      });
    }

    // and then listen for changes
    locator<AlertService>().unreadAlertStream.listen((int unreadCount) {
      if (!mounted) return;

      setState(() {
        _unreadAlertCount = unreadCount;
      });

      if (unreadCount > 0) {
        _startShake();

        _shakeTimer?.cancel();
        _shakeTimer = Timer.periodic(_timeBetweenShakes, (Timer timer) {
          _startShake();
        });
      } else {
        _stopShake();
      }
    });

    _searchFocus.addListener(() {
      if (!_searchFocus.hasFocus && _searchController.text.isEmpty) {
        setState(() {
          _showSearchBar = false;
        });
      }
    });

    _eventBusSubscription = locator<EventBus>().stream.listen((DomainEvent event) {
      if (!mounted) return;

      if (event is UserProfileUpdatedEvent || event is UserAvatarUpdatedEvent) {
        setState(() {});
        return;
      }

      if (event is RootNavigationContextChangedEvent) {
        setState(() {
          _showSearchBar = false;
          _searchController.clear();
          _searchFieldController?.clear();
        });
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _eventBusSubscription?.cancel();
    _shakeTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: Header.height,
      padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
      decoration: BoxDecoration(
        color: context.colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: context.colorScheme.outlineVariant),
        ),
      ),
      child: Row(
        children: <Widget>[
          BlocSelector<HeaderCubit, HeaderCubitState, Widget?>(
            bloc: locator<HeaderCubit>(),
            selector: (HeaderCubitState state) => state.title,
            builder: (BuildContext context, Widget? title) {
              if (title == null) {
                return const SizedBox();
              }
              return DefaultTextStyle(
                style: context.textTheme.subtitleSmall,
                child: title,
              );
            },
          ),
          // TODOsee why we need this
          const Expanded(
            child: Row(
              children: <Widget>[SizedBox()],
            ),
          ),
          AnimatedContainer(
            duration: fadeAnimationDuration,
            width: _showSearchBar ? 300 : 32,
            child: Stack(
              children: <Widget>[
                Positioned(
                  top: 0,
                  left: 0,
                  child: _searchBar(),
                ),
                CircleButton(
                  size: 32,
                  image: "lib/assets/icons/search.png",
                  package: packageName,
                  iconSize: 24,
                  borderColor: Colors.transparent,
                  onPressed: () {
                    setState(() {
                      _showSearchBar = !_showSearchBar;
                      if (!_showSearchBar) {
                        _searchController.clear();
                        _searchFieldController?.clear();
                      }
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(width: Sizing.small),
          Stack(
            children: <Widget>[
              _bell(),
              if (_unreadAlertCount > 0)
                Positioned(
                  top: 2,
                  right: 0,
                  child: Container(
                    height: 18,
                    width: 18,
                    decoration: BoxDecoration(
                      color: context.colorScheme.error,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        _unreadAlertCount.toString(),
                        style: context.textTheme.labelTiny.copyWith(color: context.colorScheme.onError),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: Sizing.small),
          InkWell(
            onTap: () {
              locator<DrawerCubit>().showRight(const ProfileDrawer());
            },
            child: ProfileWidget(
              user: locator<UserService>().currentUser,
              radius: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _searchBar() {
    return BlocSelector<HeaderCubit, HeaderCubitState, String?>(
      bloc: locator<HeaderCubit>(),
      selector: (HeaderCubitState state) => state.searchText,
      builder: (BuildContext context, String? searchText) {
        if (searchText == null && _searchController.text.isNotEmpty) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            _searchFieldController?.clear();
            _searchController.clear();
          });
        }

        return ClipRRect(
          clipBehavior: Clip.hardEdge,
          borderRadius: BorderRadius.circular(16),
          child: AnimatedContainer(
            duration: _showSearchBar ? fastAnimationDuration : fadeAnimationDuration,
            width: _showSearchBar ? 300 : 0,
            height: 32,
            child: TypeAheadField<String>(
              focusNode: _searchFocus,
              suggestionsCallback: (String search) {
                return _searchHistory.where((String entry) => entry.startsWith(search)).toList();
              },
              emptyBuilder: (BuildContext context) => const SizedBox(),
              decorationBuilder: (BuildContext context, Widget child) {
                return Material(
                  type: MaterialType.card,
                  elevation: 4,
                  color: context.colorScheme.surface,
                  borderRadius: smBorderRadiusAll,
                  child: child,
                );
              },
              builder: (BuildContext context, TextEditingController controller, FocusNode focusNode) {
                _searchFieldController = controller;
                controller.addListener(() {
                  _searchController.text = controller.text;
                });

                return IconTextField(
                  leadingWidget: const SizedBox(width: 0),
                  borderRadius: 16,
                  hintText: "Search",
                  focusNode: focusNode,
                  backgroundColor: context.colorScheme.tertiary,
                  controller: controller,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  showBorder: false,
                  onSubmit: (String entry) {
                    _addSearchHistory(entry);
                  },
                );
              },
              itemSeparatorBuilder: (BuildContext context, int index) => Divider(
                color: context.colorScheme.tertiary,
              ),
              itemBuilder: (BuildContext context, String option) {
                return Material(
                  type: MaterialType.transparency,
                  child: ListTile(
                    title: Text(option),
                    titleTextStyle: context.textTheme.labelLarge,
                    hoverColor: context.colorScheme.tertiaryFixed,
                  ),
                );
              },
              onSelected: (String option) {
                _searchFieldController?.text = option;
                _searchController.text = option;
              },
            ),
          ),
        );
      },
    );
  }

  void _addSearchHistory(String entry) {
    setState(() {
      if (_searchHistory.contains(entry)) {
        _searchHistory.remove(entry);
      }

      _searchHistory.insert(0, entry);
      if (_searchHistory.length > maxSearchHistory) {
        _searchHistory.removeLast();
      }
    });
  }

  Widget _bell() {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: handleBellTap,
      child: AnimatedRotation(
        duration: fadeAnimationDuration,
        turns: _bellRotation,
        alignment: const Alignment(0, -0.60),
        child: Container(
          padding: const EdgeInsets.all(Sizing.xSmall),
          height: 40,
          width: 40,
          child: Center(
            child: Image.asset(
              "lib/assets/icons/bell.png",
              package: packageName,
              color: context.colorScheme.onSurface,
              height: 24,
              width: 24,
            ),
          ),
        ),
      ),
    );
  }

  @protected
  void handleBellTap() {
    Log.logger.e("handlBellTap Not implemented");
  }

  void _startShake() {
    if (_isShaking) {
      return;
    }

    _shakeCount = 0;
    _shouldShake = true;
    _isShaking = true;

    Timer.periodic(fadeAnimationDuration, (Timer timer) {
      if (!mounted) {
        timer.cancel();
        _isShaking = false;
        return;
      }

      setState(() {
        if (!_shouldShake) {
          timer.cancel();
          _isShaking = false;
          return;
        }

        _shakeCount++;

        if (_shakeCount >= _shakeLimit) {
          timer.cancel();
          _bellRotation = 0;
          _isShaking = false;
          return;
        }

        _bellRotation = _shakeCount.isEven ? 0.015 : -0.015;
      });
    });
  }

  void _stopShake() {
    _shouldShake = false;
    _shakeTimer?.cancel();

    setState(() {
      _isShaking = false;
    });
  }
}
