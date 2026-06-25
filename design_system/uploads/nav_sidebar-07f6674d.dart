import "dart:async";

import "package:flutter/material.dart";
import "package:mx_core/mx_core.dart";

class NavSidebarParams {
  const NavSidebarParams({
    required this.onOptionSelected,
    required this.onLogout,
  });

  final Function(FeatureFlag) onOptionSelected;
  final Function() onLogout;
}

class NavSidebar extends StatefulWidget {
  const NavSidebar({required this.params, super.key});

  factory NavSidebar.builder(NavSidebarParams params, Key? key) => NavSidebar(params: params, key: key);

  final NavSidebarParams params;

  @override
  State<NavSidebar> createState() => NavSidebarState();
}

class NavSidebarState extends State<NavSidebar> {
  @protected
  bool collaped = false;
  @protected
  bool showLabels = true;
  @protected
  late FeatureFlag currentOption;
  @protected
  late WorkspaceSettings workspaceSettings;
  @protected
  late List<FeatureFlag> currentTabs;
  @protected
  bool showRoleSpoofBanner = false;

  @protected
  String? versionString;

  StreamSubscription<DomainEvent>? _eventBusSubscription;

  @override
  void initState() {
    super.initState();

    final User? currentUser = locator<AuthService>().currentUser;
    showRoleSpoofBanner = currentUser?.role.level != currentUser?.trueRole.level;

    workspaceSettings = locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();
    currentTabs = tabFlags.where((FeatureFlag flag) => locator<FeatureService>().isEnabled(flag)).toList();
    Log.logger.d(
      "[NavSidebar] initState: tabFlags=${tabFlags.map((FeatureFlag f) => f.key).toList()}, "
      "currentTabs=${currentTabs.map((FeatureFlag f) => f.key).toList()}",
    );
    currentOption = currentTabs.isNotEmpty ? currentTabs.first : tabFlags.first;

    getVersionString().then((String version) => setState(() => versionString = version));

    _eventBusSubscription = locator<EventBus>().stream.listen((DomainEvent event) {
      if (!mounted) return;

      if (event is WorkspaceSettingsUpdated) {
        setState(() {
          workspaceSettings = locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();
        });
        return;
      }

      if (event is WorkspaceUserRoleUpdated || event is FeatureFlagsChanged) {
        setState(() {
          final User? currentUser = locator<AuthService>().currentUser;
          showRoleSpoofBanner = currentUser?.role.level != currentUser?.trueRole.level;

          currentTabs = tabFlags.where((FeatureFlag flag) => locator<FeatureService>().isEnabled(flag)).toList();

          if (!currentTabs.contains(currentOption)) {
            currentOption = currentTabs.isNotEmpty ? currentTabs.first : tabFlags.first;
            widget.params.onOptionSelected(currentOption);
            return;
          }
        });
        return;
      }
    });
  }

  @override
  void dispose() {
    _eventBusSubscription?.cancel();
    super.dispose();
  }

  /// Ordered list of tab flags this sidebar can display. Subclasses override to add domain tabs.
  @protected
  List<FeatureFlag> get tabFlags => <FeatureFlag>[
    FeatureFlag.termsTab,
    FeatureFlag.ticketsTab,
    FeatureFlag.libraryTab,
    FeatureFlag.oralExamsTab,
    FeatureFlag.inventoryTab,
    FeatureFlag.assistantTab,
    FeatureFlag.analyticsTab,
    FeatureFlag.controlTowerTab,
  ];

  @override
  Widget build(BuildContext context) {
    const double logoSize = 36;

    return AnimatedContainer(
      duration: fadeAnimationDuration,
      onEnd: () {
        setState(() {
          if (!collaped) {
            showLabels = true;
          }
        });
      },
      width: collaped ? (Sizing.large * 2) + 42 : 224,
      padding: const EdgeInsets.all(Sizing.med),
      decoration: BoxDecoration(
        color: context.colorScheme.surface,
        border: Border(
          right: BorderSide(color: context.colorScheme.outlineVariant),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapUp: (TapUpDetails details) => showContextMenu(
                  context,
                  position: details.globalPosition,
                  options: <MenuOption>[
                    MenuOption(
                      label: locator<WorkspaceService>().currentWorkspace?.name ?? "Unknown",
                      border: Border(bottom: BorderSide(color: context.colorScheme.tertiaryFixed)),
                    ),
                    MenuOption(
                      label: "Switch Workspace...",
                      handler: () => locator<AuthService>().logout(),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    if (showLabels)
                      if (locator<WorkspaceService>().currentWorkspace?.logo?.isNotEmpty ?? false)
                        Image.network(
                          locator<WorkspaceService>().currentWorkspace!.logo!,
                          fit: BoxFit.fitHeight,
                          height: logoSize,
                          errorBuilder: errorImageBuilder(),
                        )
                      else
                        Image.asset(
                          "lib/assets/images/logo.png",
                          package: packageName,
                          fit: BoxFit.fitHeight,
                          width: logoSize,
                          height: logoSize,
                          color: context.colorScheme.primary,
                        )
                    else
                      const SizedBox(height: logoSize),
                  ],
                ),
              ),
              const SizedBox(height: Sizing.small),
              Center(
                child: SizedBox(
                  height: 24,
                  child: AnimatedSwitcher(
                    duration: fastAnimationDuration,
                    child: showLabels && (locator<WorkspaceService>().currentWorkspace?.logo?.isEmpty ?? true)
                        ? Text(
                            key: const ValueKey<String>("label"),
                            locator<WorkspaceService>().currentWorkspace?.name ?? "Unknown",
                            style: context.textTheme.subtitleLarge,
                          )
                        : const SizedBox(
                            key: ValueKey<String>("none"),
                          ),
                  ),
                ),
              ),
              AnimatedSwitcher(
                duration: fadeAnimationDuration,
                child: showRoleSpoofBanner
                    ? Padding(
                        key: const ValueKey<String>("spoof"),
                        padding: const EdgeInsets.only(top: Sizing.med),
                        child: Tooltip(
                          message: "${workspaceSettings.getString(WorkspaceSettings.viewerKey)} Mode",
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: Sizing.small,
                              vertical: Sizing.xSmall,
                            ),
                            decoration: BoxDecoration(
                              color: context.accentColors.accent5,
                              borderRadius: smBorderRadiusAll,
                            ),
                            child: Center(
                              child: showLabels
                                  ? Text(
                                      "${workspaceSettings.getString(WorkspaceSettings.viewerKey)} Mode",
                                      style: context.textTheme.labelMediumSemiBold.copyWith(
                                        color: context.accentColors.accent4,
                                      ),
                                    )
                                  : Icon(
                                      Icons.visibility_outlined,
                                      size: 16,
                                      color: context.accentColors.accent4,
                                    ),
                            ),
                          ),
                        ),
                      )
                    : const SizedBox(
                        key: Key("no_banner"),
                        height: 49,
                      ),
              ),
              const SizedBox(height: Sizing.large),
              Padding(
                padding: const EdgeInsets.only(left: Sizing.med - 4),
                child: CircleChevron(onPressed: toggleLabels),
              ),
              const SizedBox(height: Sizing.small),
              ...currentTabs.map((FeatureFlag tab) => buildTab(tab)),
            ],
          ),
          Column(
            children: <Widget>[
              if (locator<FeatureService>().isEnabled(FeatureFlag.teamWorkspaceTab))
                sidebarOption(
                  icon: Icon(
                    Icons.group_outlined,
                    size: 24,
                    color: context.colorScheme.primary,
                  ),
                  label: "Workspace",
                  isActive: currentOption == FeatureFlag.teamWorkspaceTab,
                  onPressed: () {
                    setState(() {
                      currentOption = FeatureFlag.teamWorkspaceTab;
                      widget.params.onOptionSelected(currentOption);
                    });
                  },
                ),
              const SizedBox(height: Sizing.med),
              sidebarOption(
                icon: Image.asset(
                  "lib/assets/icons/tabs/logout.png",
                  package: packageName,
                  height: 24,
                  width: 24,
                  color: context.colorScheme.onSurface,
                ),
                label: "Logout",
                isActive: false,
                onPressed: () {
                  LoadingOverlay.of(context).show();
                  widget.params.onLogout();
                },
              ),
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    if (showLabels)
                      Text(
                        "Version:",
                        style: context.textTheme.labelSmall.copyWith(color: context.colorScheme.onTertiary),
                      ),
                    Text(
                      versionString ?? "",
                      style: context.textTheme.labelSmall.copyWith(color: context.colorScheme.onTertiary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @protected
  void toggleLabels() {
    setState(() {
      collaped = !collaped;
      if (collaped) {
        showLabels = false;
      }
    });
  }

  /// Builds the sidebar widget for a given tab flag. Subclasses override to add domain tabs.
  @protected
  Widget buildTab(FeatureFlag tab) {
    // ── Edu tabs ────────────────────────────────────────────────
    if (tab == FeatureFlag.termsTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/tabs/home.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: workspaceSettings.getString(WorkspaceSettings.termsKey),
        isActive: currentOption == FeatureFlag.termsTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.termsTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    if (tab == FeatureFlag.oralExamsTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/talk.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: "Oral Exams",
        isActive: currentOption == FeatureFlag.oralExamsTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.oralExamsTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    // ── Comm tabs ───────────────────────────────────────────────
    if (tab == FeatureFlag.ticketsTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/tabs/home.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: workspaceSettings.getString(WorkspaceSettings.ticketsKey),
        isActive: currentOption == FeatureFlag.ticketsTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.ticketsTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    if (tab == FeatureFlag.inventoryTab) {
      return sidebarOption(
        icon: Icon(
          Icons.shelves,
          size: 24,
          color: context.colorScheme.primary,
        ),
        label: "Inventory Mgr",
        isActive: currentOption == FeatureFlag.inventoryTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.inventoryTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    // ── Shared tabs ─────────────────────────────────────────────
    if (tab == FeatureFlag.libraryTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/tabs/library.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: "Library",
        isActive: currentOption == FeatureFlag.libraryTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.libraryTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    if (tab == FeatureFlag.analyticsTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/tabs/analytics.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: "Analytics",
        isActive: currentOption == FeatureFlag.analyticsTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.analyticsTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    if (tab == FeatureFlag.controlTowerTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/icons/tower.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: "Control Tower",
        isActive: currentOption == FeatureFlag.controlTowerTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.controlTowerTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    if (tab == FeatureFlag.assistantTab) {
      return sidebarOption(
        icon: Image.asset(
          "lib/assets/images/orionLogo.png",
          package: packageName,
          height: 24,
          width: 24,
          color: context.colorScheme.primary,
        ),
        label: "Assistant",
        isActive: currentOption == FeatureFlag.assistantTab,
        onPressed: () {
          setState(() {
            currentOption = FeatureFlag.assistantTab;
            widget.params.onOptionSelected(currentOption);
          });
        },
      );
    }

    return const SizedBox.shrink();
  }

  Widget sidebarOption({
    required Widget icon,
    required String label,
    required bool isActive,
    Color? color,
    required Function() onPressed,
  }) {
    return Container(
      height: 56,
      margin: const EdgeInsets.only(top: Sizing.med),
      padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(smallBorderRadius),
        color: isActive ? context.colorScheme.surfaceContainerLowest : Colors.transparent,
      ),
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onPressed,
          child: Row(
            children: <Widget>[
              icon,
              if (showLabels)
                Padding(
                  padding: const EdgeInsets.only(left: Sizing.med),
                  child: Text(
                    label,
                    style: context.textTheme.navigation.copyWith(color: color ?? context.colorScheme.onSurface),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
