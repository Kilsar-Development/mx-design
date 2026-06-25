import "dart:async";

import "package:edu_core/edu_core.dart";
import "package:flutter/material.dart";

import "common/nav_sidebar.dart";

@RoutePage()
class RootNavigationScreenWeb extends StatefulWidget {
  const RootNavigationScreenWeb({super.key});

  @override
  State<RootNavigationScreenWeb> createState() => RootNavigationScreenWebState();
}

class RootNavigationScreenWebState extends State<RootNavigationScreenWeb> {
  @protected
  final StreamController<UploadUpdate> uploadStreamController = StreamController<UploadUpdate>.broadcast();
  @protected
  final StreamController<bool> uploadCompleteController = StreamController<bool>.broadcast();
  @protected
  final StreamController<bool> showAlertController = StreamController<bool>.broadcast();
  @protected
  FeatureFlag selectedOption = FeatureFlag.termsTab;

  StreamSubscription<DomainEvent>? _eventSubscription;

  @override
  void initState() {
    super.initState();

    final WorkspaceService workspaceService = locator<WorkspaceService>();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // handles if the startup service is ready before we are
      if (locator<StartupService>().isReady && await locator<WorkspaceService>().shouldShowMotd()) {
        _showMotd();
        workspaceService.markMotdAsShown();
        return;
      }
    });

    _eventSubscription = locator<EventBus>().stream.listen((DomainEvent event) async {
      if (!mounted) return;

      if (event is StartupServiceReadyEvent) {
        setState(() => isInitialLoad = false);
        if (await workspaceService.shouldShowMotd()) {
          _showMotd();
          workspaceService.markMotdAsShown();
        }
        return;
      }

      if (event is ShowOrionFeedbackRequested) {
        _showOrionFeedbackDialog(event.sessionId);
        return;
      }
    });
  }

  void _showOrionFeedbackDialog(String sessionId) {
    locator<DrawerCubit>().showDialog(
      UserFeedbackDialog(
        sessionId: sessionId,
        location: FeedbackLocationExt.orion,
        title: "Finding Orion Useful?",
        onClose: () => locator<DrawerCubit>().hideDialog(),
      ),
    );
  }

  @override
  void dispose() {
    uploadStreamController.close();
    showAlertController.close();
    _eventSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const GlobalObjectKey("root"),
      body: UploadProgressDialog(
        infoStream: uploadStreamController.stream,
        uploadCompleteSink: uploadCompleteController.sink,
        child: LoadingOverlay(
          child: DrawerOverlay(
            child: Center(
              child: Row(
                children: <Widget>[
                  NavSidebar(
                    params: NavSidebarParams(
                      onOptionSelected: _onOptionSelected,
                      onLogout: () => locator<AuthService>().logout(),
                    ),
                  ),
                  Expanded(
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height,
                      child: Column(
                        children: <Widget>[
                          locator<Header>(),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(Sizing.large),
                              // ignore: deprecated_member_use
                              color: context.colorScheme.surfaceVariant,
                              child: const AutoRouter(clipBehavior: Clip.none),
                            ),
                          ),
                        ],
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

  void _onOptionSelected(FeatureFlag tab) {
    if (selectedOption == tab) {
      return;
    }

    locator<EventBus>().emit(RootNavigationContextChangedEvent());

    setState(() {
      selectedOption = tab;

      if (tab == FeatureFlag.termsTab) {
        context.router.push(const TermsDashboardRouteWeb());
      } else if (tab == FeatureFlag.libraryTab) {
        context.router.push(
          LibraryRouteWeb(
            uploadSink: uploadStreamController.sink,
            uploadCompleteStream: uploadCompleteController.stream,
          ),
        );
      } else if (tab == FeatureFlag.teamWorkspaceTab) {
        context.router.push(const TeamWorkspaceRouteWeb());
      } else if (tab == FeatureFlag.analyticsTab) {
        context.router.push(const AnalyticsRouteWeb());
      } else if (tab == FeatureFlag.controlTowerTab) {
        context.router.push(const ControlTowerRouteWeb());
      } else if (tab == FeatureFlag.oralExamsTab) {
        context.router.push(const ExamTopicsRouteWeb());
      } else if (tab == FeatureFlag.assistantTab) {
        context.router.push(const AssistantRouteWeb());
      } else if (tab == FeatureFlag.ticketsTab) {
        context.router.navigatePath("tickets");
      } else if (tab == FeatureFlag.inventoryTab) {
        context.router.navigatePath("invMgr");
      } else {
        Log.logger.e("_onOptionSelected: unhandled tab key=${tab.key}");
      }
    });
  }

  void _showMotd() {
    final MotdSettings? motdSettings = locator<WorkspaceService>().currentWorkspace?.settings.motdSettings;
    if (!mounted || motdSettings == null) {
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
