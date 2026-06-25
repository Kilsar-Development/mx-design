import "dart:async";

import "package:edu_core/edu_core.dart";
import "package:flutter/material.dart";

@RoutePage()
class RootNavigationScreen extends StatefulWidget {
  const RootNavigationScreen({super.key});

  @override
  State<RootNavigationScreen> createState() => RootNavigationScreenState();
}

class RootNavigationScreenState extends State<RootNavigationScreen> {
  int _selectedIndex = 0;
  int _unreadAlertCount = 0;

  final double _barIconSize = 32;

  bool _dialogIsShown = false;
  String? _chatSessionId;

  StreamSubscription<DomainEvent>? _eventSubscription;

  @override
  void initState() {
    super.initState();

    _unreadAlertCount = locator<AlertService>().unreadCount;
    locator<AlertService>().unreadAlertStream.listen((int unreadCount) {
      if (!mounted) return;

      setState(() => _unreadAlertCount = unreadCount);
    });

    _eventSubscription = locator<EventBus>().stream.listen((DomainEvent event) {
      if (!mounted) return;

      if (event is StartupServiceReadyEvent) {
        setState(() => isInitialLoad = false);
        return;
      }

      if (event is ShowOrionFeedbackRequested) {
        setState(() {
          _chatSessionId = event.sessionId;
          _dialogIsShown = true;
        });
        return;
      }

      if (event is NavigateToTabEvent) {
        setState(() => _selectedIndex = event.tabIndex);
        return;
      }

      if (event is NavigateToWorkspaceFilterEvent) {
        setState(() => _selectedIndex = 1);
        return;
      }
    });
  }

  final List<Widget> _tabScreens = <Widget>[
    const HomeScreen(),
    const WorkspaceScreen(),
    const AssistantScreen(),
    const AlertScreen(),
  ];

  @override
  void dispose() {
    _eventSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DialogOverlay(
      isShown: _dialogIsShown,
      body: _userFeedbackDialog,
      onClose: () => setState(() => _dialogIsShown = false),
      child: Scaffold(
        body: ColoredSafeArea(
          child: LoadingOverlay(
            child: _tabScreens[_selectedIndex],
          ),
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: context.colorScheme.surface,
            border: Border(top: BorderSide(color: context.colorScheme.tertiary)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              const SizedBox(height: Sizing.xSmall),
              BottomNavigationBar(
                currentIndex: _selectedIndex,
                onTap: _onItemTapped,
                selectedItemColor: context.colorScheme.onSurface,
                unselectedItemColor: context.colorScheme.onSurfaceVariant,
                showUnselectedLabels: true,
                selectedFontSize: context.textTheme.labelMediumMedium.fontSize!,
                unselectedFontSize: context.textTheme.labelMediumMedium.fontSize!,
                type: BottomNavigationBarType.fixed,
                backgroundColor: context.colorScheme.surface,
                items: bottomNavigationBarItems,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget get _userFeedbackDialog => UserFeedbackDialog(
    sessionId: _chatSessionId,
    location: FeedbackLocationExt.orion,
    title: "Finding Orion Useful?",
    onClose: () => setState(() => _dialogIsShown = false),
  );

  @protected
  List<BottomNavigationBarItem> get bottomNavigationBarItems => <BottomNavigationBarItem>[
    BottomNavigationBarItem(
      activeIcon: Image.asset(
        "lib/assets/icons/tabs/home.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurface,
      ),
      icon: Image.asset(
        "lib/assets/icons/tabs/home.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurfaceVariant,
      ),
      label: "Home",
    ),
    BottomNavigationBarItem(
      activeIcon: Image.asset(
        "lib/assets/icons/modules.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurface,
      ),
      icon: Image.asset(
        "lib/assets/icons/modules.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurfaceVariant,
      ),
      label: "Workspace",
    ),
    BottomNavigationBarItem(
      activeIcon: Image.asset(
        "lib/assets/icons/orionOutline.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurface,
      ),
      icon: Image.asset(
        "lib/assets/icons/orionOutline.png",
        package: packageName,
        height: _barIconSize,
        width: _barIconSize,
        color: context.colorScheme.onSurfaceVariant,
      ),
      label: "Orion",
    ),
    BottomNavigationBarItem(
      activeIcon: Badge(
        backgroundColor: context.colorScheme.error,
        textColor: context.colorScheme.onError,
        textStyle: context.textTheme.labelSmall,
        label: Text(_unreadAlertCount.toString()),
        isLabelVisible: _unreadAlertCount > 0,
        child: Image.asset(
          "lib/assets/icons/bell.png",
          package: packageName,
          height: _barIconSize,
          width: _barIconSize,
          color: context.colorScheme.onSurface,
        ),
      ),
      icon: Badge(
        backgroundColor: context.colorScheme.error,
        textColor: context.colorScheme.onError,
        textStyle: context.textTheme.labelSmall,
        label: Text(_unreadAlertCount.toString()),
        isLabelVisible: _unreadAlertCount > 0,
        child: Image.asset(
          "lib/assets/icons/bell.png",
          package: packageName,
          height: _barIconSize,
          width: _barIconSize,
          color: context.colorScheme.onSurfaceVariant,
        ),
      ),
      label: "Notifications",
    ),
  ];
}
