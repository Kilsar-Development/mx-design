import "dart:async";

import "package:flutter/material.dart";
import "package:flutter_bloc/flutter_bloc.dart";
import "package:mx_core/mx_core.dart";

import "../../../../models/Terms/term.dart";
import "../../../../services/TermService/term_service.dart";

import "Components/active_terms_section.dart";
import "Components/continue_working_section.dart";
import "Components/pending_review_section.dart";
import "Components/todo_list_section.dart";
import "cubit/home_screen_cubit.dart";

const String HOME_SPLASH_DISMISSED = "home_splash_dismissed";

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final HomeScreenCubit _homeScreenCubit = HomeScreenCubit();

  late WorkspaceSettings _workspaceSettings;

  User? _currentUser;

  StreamSubscription<DomainEvent>? _eventSubscription;

  bool _splashDismissed = true;
  bool _splashStateLoaded = false;

  final bool _forceShowSplash = false;
  bool _showRoleSpoofBanner = false;

  @override
  void initState() {
    super.initState();

    final WorkspaceService workspaceService = locator<WorkspaceService>();
    _workspaceSettings = workspaceService.currentWorkspace?.settings ?? WorkspaceSettings();

    _loadSplashDismissedState();

    _currentUser = locator<UserService>().currentUser;
    _showRoleSpoofBanner = _currentUser?.role.level != _currentUser?.trueRole.level;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted) return;

      if (locator<StartupService>().isReady && await locator<WorkspaceService>().shouldShowMotd()) {
        _showMotd();
        workspaceService.markMotdAsShown();
      }
    });

    _eventSubscription = locator<EventBus>().stream.listen((DomainEvent event) async {
      if (!mounted) return;

      if (event is UserProfileUpdatedEvent || event is UserAvatarUpdatedEvent) {
        setState(() => _currentUser = locator<UserService>().currentUser);
        return;
      }

      if (event is StartupServiceReadyEvent) {
        if (await workspaceService.shouldShowMotd()) {
          _showMotd();
          workspaceService.markMotdAsShown();
        }
        return;
      }

      if (event is WorkspaceSettingsUpdated) {
        setState(() {
          _workspaceSettings = locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();
        });
        return;
      }

      if (event is WorkspaceUserRoleUpdated) {
        setState(() {
          final User? currentUser = locator<AuthService>().currentUser;
          _showRoleSpoofBanner = currentUser?.role.level != currentUser?.trueRole.level;
        });
        return;
      }
    });
  }

  @override
  void dispose() {
    _eventSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isStudent = locator<AuthService>().currentUser?.role.level == RoleLevel.viewer;
    final bool showSplash = _splashStateLoaded && (_forceShowSplash || (!_splashDismissed && !_hasContent()));
    return BlocProvider<HomeScreenCubit>.value(
      value: _homeScreenCubit,
      child: LoadingOverlay(
        child: BlocListener<HomeScreenCubit, HomeScreenState>(
          listener: (BuildContext context, HomeScreenState state) {
            if (state is HomeProcessing) {
              LoadingOverlay.of(context).show();
            } else {
              LoadingOverlay.of(context).hide();
            }
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: Sizing.small),
            child: Column(
              children: <Widget>[
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _homeScreenCubit.refresh,
                    child: showSplash ? _buildEmptyStatePage() : _buildHomePage(isStudent),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _loadSplashDismissedState() async {
    final String? dismissed = await locator<StorageService>().read(HOME_SPLASH_DISMISSED);
    if (mounted) {
      setState(() {
        _splashDismissed = dismissed == "true";
        _splashStateLoaded = true;
      });
    }
  }

  Future<void> _dismissSplash() async {
    await locator<StorageService>().write(HOME_SPLASH_DISMISSED, "true");
    setState(() {
      _splashDismissed = true;
    });
  }

  bool _hasContent() {
    final bool isStudent = locator<AuthService>().currentUser?.role.level == RoleLevel.viewer;

    if (isStudent) {
      final String? currentUserId = locator<AuthService>().currentUser?.id;
      if (currentUserId == null) return false;

      final List<Term> terms = locator<TermService>().terms;
      return terms.any((Term term) => term.studentIds.contains(currentUserId));
    } else {
      final List<Term> terms = locator<TermService>().terms;
      return terms.any((Term term) => term.studentIds.isNotEmpty);
    }
  }

  Widget _buildHomePage(bool isStudent) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          _buildHeader(),
          const SizedBox(height: Sizing.med),
          if (isStudent) const ContinueWorkingSection() else const PendingReviewSection(),
          const SizedBox(height: Sizing.med),
          const ActiveTermsSection(),
          const SizedBox(height: Sizing.med),
          const TodoListSection(),
          const SizedBox(height: Sizing.xLarge),
        ],
      ),
    );
  }

  Widget _buildEmptyStatePage() {
    final WorkspaceSettings workspaceSettings =
        locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();
    final bool isStudent = locator<AuthService>().currentUser?.role.level == RoleLevel.viewer;

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: SizedBox(
        height: MediaQuery.of(context).size.height - 200,
        child: Column(
          children: <Widget>[
            _buildHeader(),
            const SizedBox(height: Sizing.xLarge),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: <Color>[
                          context.accentColors.accent4?.withValues(alpha: .15) ?? context.colorScheme.surface,
                          context.accentColors.accent2?.withValues(alpha: 0.1) ??
                              context.colorScheme.surfaceContainerLow,
                        ],
                      ),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: context.accentColors.accent4?.withValues(alpha: 0.3) ?? context.colorScheme.outline,
                        width: 2,
                      ),
                      boxShadow: <BoxShadow>[
                        BoxShadow(
                          color:
                              context.accentColors.accent4?.withValues(alpha: 0.2) ??
                              context.colorScheme.primary.withValues(alpha: 0.1),
                          blurRadius: 30,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        Icons.airplanemode_active_rounded,
                        size: 90,
                        color: context.accentColors.accent4 ?? context.colorScheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: Sizing.large),
                  Text(
                    "Welcome, ${_currentUser?.firstName ?? "there"}!",
                    style: context.textTheme.h2,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: Sizing.small),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Sizing.large),
                    child: Text(
                      isStudent
                          ? "You're not enrolled in any ${workspaceSettings.getString(WorkspaceSettings.termsKey).toLowerCase()} yet"
                          : "You don't have any ${workspaceSettings.getString(WorkspaceSettings.viewerKey).toLowerCase()}s enrolled yet",
                      style: context.textTheme.bodyLarge.copyWith(
                        color: context.colorScheme.onSurfaceVariant,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: Sizing.xLarge),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
                    child: Row(
                      children: <Widget>[
                        Expanded(
                          child: _buildActionCard(
                            icon: Icons.school_outlined,
                            title: "Get Started",
                            subtitle: isStudent ? "View your home screen" : "View your dashboard",
                            accentColor: context.accentColors.accent1 ?? context.colorScheme.primary,
                            onTap: _dismissSplash,
                          ),
                        ),
                        const SizedBox(width: Sizing.small),
                        Expanded(
                          child: _buildActionCard(
                            icon: Icons.explore_outlined,
                            title: "Explore",
                            subtitle: "Browse the workspace",
                            accentColor: context.accentColors.accent4 ?? context.colorScheme.primary,
                            onTap: () {
                              _dismissSplash();
                              locator<EventBus>().emit(NavigateToTabEvent(1));
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color accentColor,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 140,
        padding: const EdgeInsets.all(Sizing.small),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: <Color>[
              context.colorScheme.surface,
              context.colorScheme.surfaceContainerLow,
            ],
          ),
          borderRadius: medBorderRadiusAll,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: accentColor,
                borderRadius: smBorderRadiusAll,
              ),
              child: Center(
                child: Icon(
                  icon,
                  size: 24,
                  color: context.colorScheme.onPrimary,
                ),
              ),
            ),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    title,
                    style: context.textTheme.labelLargeBold,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: Sizing.tiny),
                  Text(
                    subtitle,
                    style: context.textTheme.labelSmall.copyWith(
                      color: context.colorScheme.onSurfaceVariant,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    const double logoSize = 40;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        InkWell(
          onTapUp: (TapUpDetails details) {
            showContextMenu(
              context,
              position: details.globalPosition,
              options: <MenuOption>[
                MenuOption(
                  label: "Switch Workspace...",
                  handler: () => locator<AuthService>().logout(),
                ),
              ],
            );
          },
          child: locator<WorkspaceService>().currentWorkspace?.logo?.isNotEmpty ?? false
              ? Image.network(
                  locator<WorkspaceService>().currentWorkspace!.logo!,
                  fit: BoxFit.fitHeight,
                  height: logoSize,
                  errorBuilder: errorImageBuilder(size: logoSize),
                )
              : Image.asset(
                  "lib/assets/images/logo.png",
                  package: packageName,
                  fit: BoxFit.fitHeight,
                  height: logoSize,
                  color: context.colorScheme.primary,
                ),
        ),
        Row(
          children: <Widget>[
            AnimatedOpacity(
              duration: fadeAnimationDuration,
              opacity: _showRoleSpoofBanner ? 1 : 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: Sizing.small, vertical: Sizing.xSmall),
                decoration: BoxDecoration(
                  color: context.accentColors.accent5,
                  borderRadius: smBorderRadiusAll,
                ),
                child: Center(
                  child: Text(
                    "${_workspaceSettings.getString(WorkspaceSettings.viewerKey)} Mode",
                    style: context.textTheme.labelMediumSemiBold.copyWith(
                      color: context.accentColors.accent4,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: Sizing.small),
            InkWell(
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  shape: bottomModalCorners,
                  isScrollControlled: true,
                  builder: (BuildContext sheetContext) => const FractionallySizedBox(
                    heightFactor: 0.9,
                    child: SheetOverlay(
                      title: "Your Profile",
                      child: ProfileScreen(),
                    ),
                  ),
                );
              },
              child: ProfileWidget(user: _currentUser),
            ),
          ],
        ),
      ],
    );
  }

  void _showMotd() {
    if (!mounted) return;

    final MotdSettings? motdSettings = locator<WorkspaceService>().currentWorkspace?.settings.motdSettings;
    if (motdSettings == null) {
      Log.logger.e("MOTD settings are null, cannot show MOTD");
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertPrompt(
          title: motdSettings.title ?? "Message of the Day:",
          body: MarkdownBody(
            data: motdSettings.message,
            styleSheet: commonMarkdownStyleSheet(context),
          ),
          actions: <AlertAction>[
            AlertAction(label: "OK", onPressed: () => Navigator.of(context).pop()),
          ],
        );
      },
    );
  }
}
