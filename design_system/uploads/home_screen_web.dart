import "dart:async";

import "package:flutter/material.dart";
import "package:flutter_bloc/flutter_bloc.dart";
import "package:mx_core/mx_core.dart";

import "../../Analytics/Components/assignments_completed_graph.dart";
import "../../Analytics/Components/assistant_questions_graph.dart";
import "../../Analytics/Components/assistant_questions_table.dart";
import "../../Analytics/Components/time_in_assignment_graph.dart";
import "../../Assignments/AssignmentsScreen/assignments_screen_web.dart";
import "../../Courses/courses_screen_web.dart";
import "../../Terms/terms_screen_web.dart";
import "cubit/home_screen_cubit.dart";

@RoutePage()
class TermsDashboardScreenWeb extends StatefulWidget {
  const TermsDashboardScreenWeb({super.key});

  @override
  State<TermsDashboardScreenWeb> createState() => _TermsDashboardScreenWebState();
}

class _TermsDashboardScreenWebState extends State<TermsDashboardScreenWeb> {
  final HomeScreenCubit _homeScreenCubit = HomeScreenCubit();

  late WorkspaceSettings workspaceSettings;

  final StreamController<TermScreenUpdate> _ticketUpdateStream = StreamController<TermScreenUpdate>.broadcast();
  final StreamController<bool> _coursesRefreshStream = StreamController<bool>.broadcast();
  final StreamController<bool> _assignmentsRefreshStream = StreamController<bool>.broadcast();

  List<Widget> _headerWidgets = <Widget>[];

  Widget? _activeDialog;
  bool _showDialog = false;

  StreamSubscription<DomainEvent>? _eventSubscription;

  @override
  void initState() {
    super.initState();

    workspaceSettings = locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();

    _eventSubscription = locator<EventBus>().stream.listen((DomainEvent event) async {
      if (!mounted) return;

      if (event is WorkspaceSettingsUpdated) {
        setState(() {
          workspaceSettings = locator<WorkspaceService>().currentWorkspace?.settings ?? WorkspaceSettings();
        });
        return;
      }
    });

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      locator<HeaderCubit>().setTitleText(
        "Welcome back, ${locator<AuthService>().currentUser?.displayName ?? "Guest"}",
      );

      _setupHeaderGraphs();
    });
  }

  @override
  void dispose() {
    _ticketUpdateStream.close();
    _coursesRefreshStream.close();
    _assignmentsRefreshStream.close();
    _eventSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<HomeScreenCubit>.value(
      value: _homeScreenCubit,
      child: BlocListener<HomeScreenCubit, HomeScreenState>(
        listener: (BuildContext context, HomeScreenState state) {
          if (state is HomeProcessing) {
            LoadingOverlay.of(context).show();
          } else {
            LoadingOverlay.of(context).hide();
          }

          switch (state) {
            case HomeUserRoleUpdated _:
              setState(() {
                _headerWidgets = <Widget>[];
                _setupHeaderGraphs();
              });
            case TermsLoaded _:
              setState(() {});
            default:
          }
        },
        child: DialogOverlay(
          onClose: () => setState(() => _showDialog = false),
          body: _activeDialog ?? const SizedBox(),
          isShown: _showDialog,
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  if (_headerWidgets.isNotEmpty) _headerGraphs(),
                  Expanded(
                    flex: 5,
                    child: Container(
                      decoration: BoxDecoration(
                        color: context.colorScheme.surface,
                        borderRadius: medBorderRadiusAll,
                        border: Border.all(color: context.colorScheme.outlineVariant),
                      ),
                      child: _detailPane(),
                    ),
                  ),
                ],
              ),
              Positioned(
                bottom: Sizing.med,
                right: Sizing.med,
                child: AssistantFab(
                  onPressed: () {
                    locator<DrawerCubit>().showRight(
                      const AssistantDrawer(),
                      size: DrawerSize.wide,
                    );
                  },
  // ignore: deprecated_member_use
                  backgroundColor: context.colorScheme.surfaceVariant,
                  iconColor: context.colorScheme.onSurface,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _headerGraphs() {
    return Expanded(
      flex: 2,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.only(bottom: Sizing.med),
  // ignore: deprecated_member_use
        color: context.colorScheme.surfaceVariant,
        child: ScrollConfiguration(
          behavior: AllowAllScrollBehavior(),
          child: ListView.separated(
            shrinkWrap: true,
            scrollDirection: Axis.horizontal,
            itemCount: _headerWidgets.length,
            itemBuilder: (BuildContext context, int index) => _headerWidgets[index],
            separatorBuilder: (BuildContext context, int index) => const SizedBox(width: Sizing.med),
          ),
        ),
      ),
    );
  }

  Widget _detailPane() {
    return Stack(
      children: <Widget>[
        AnimatedSwitcher(
          duration: fadeAnimationDuration,
          child: _currentDetailPane(),
        ),
        _controls(),
      ],
    );
  }

  Widget _controls() {
    final List<String> labels = <String>[
      workspaceSettings.getString(WorkspaceSettings.termsKey),
      "${workspaceSettings.getString(WorkspaceSettings.termKey)} Templates",
      workspaceSettings.getString(WorkspaceSettings.coursesKey),
      workspaceSettings.getString(WorkspaceSettings.assignmentsKey),
    ];

    return Padding(
      padding: const EdgeInsets.all(Sizing.med),
      child: Row(
        children: <Widget>[
          CompoundSwitch(
            labels: labels,
            labelWidth: 140,
            onChange: (int selectedIndex) {
              setState(() {
                locator<HeaderCubit>().clearSearch();
                switch (selectedIndex) {
                  case 0:
                    _homeScreenCubit.setDetail(Detail.tickets);

                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      _ticketUpdateStream.add(const TermScreenUpdate());
                    });
                  case 1:
                    _homeScreenCubit.setDetail(Detail.ticketTemplates);

                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      _ticketUpdateStream.add(const TermScreenUpdate(showTerms: false));
                    });
                  case 2:
                    _homeScreenCubit.setDetail(Detail.courses);
                  case 3:
                    _homeScreenCubit.setDetail(Detail.assignments);
                }
              });
            },
          ),
          const SizedBox(width: Sizing.small),
          RefreshWidget(onTap: _refreshDetails),
        ],
      ),
    );
  }

  void _setupHeaderGraphs() {
    final StorageService storageService = locator<StorageService>();
    final bool userRoleIsSpoofed = locator<WorkspaceService>().userRoleIsSpoofed;

    if (!userRoleIsSpoofed) {
      storageService.read(AssignmentsCompletedGraph.tasksOverviewGraphShown).then((String? value) {
        if (value == null || !mounted) return;

        setState(() {
          _headerWidgets.add(const AssignmentsCompletedGraph(compact: true, width: 500));
        });
      });
    }

    if (!userRoleIsSpoofed) {
      storageService.read(TimeInAssignmentGraph.timeInAssignmentShown).then((String? value) {
        if (value == null || !mounted) return;

        setState(() {
          _headerWidgets.add(const TimeInAssignmentGraph(compact: true, width: 500));
        });
      });
    }

    if (!userRoleIsSpoofed) {
      storageService.read(AssistantQuestionsGraph.assistantQuestionsGraphShown).then((String? value) {
        if (value == null || !mounted) return;

        setState(() {
          _headerWidgets.add(const AssistantQuestionsGraph(compact: true, width: 500));
        });
      });
    }

    if (!userRoleIsSpoofed) {
      storageService.read(AssistantQuestionsTable.assistantQuestionsTableShown).then((String? value) {
        if (value == null || !mounted) return;

        setState(() {
          _headerWidgets.add(const AssistantQuestionsTable(compact: true, width: 500));
        });
      });
    }
  }

  void _refreshDetails() {
    if (_homeScreenCubit.currentDetail == Detail.tickets || _homeScreenCubit.currentDetail == Detail.ticketTemplates) {
      _ticketUpdateStream.add(
        TermScreenUpdate(
          showTerms: _homeScreenCubit.currentDetail == Detail.tickets,
          refresh: true,
        ),
      );
      return;
    }

    if (_homeScreenCubit.currentDetail == Detail.courses) {
      _coursesRefreshStream.add(true);
      return;
    }

    // else refreshing assignments
    _assignmentsRefreshStream.add(true);
  }

  Widget _currentDetailPane() {
    switch (_homeScreenCubit.currentDetail) {
      case Detail.tickets:
      case Detail.ticketTemplates:
        return TermsScreenWeb(
          updateStream: _ticketUpdateStream.stream,
          showDialog: _showChildDialog,
          closeDialog: _closeChildDialog,
          showTerms: _homeScreenCubit.currentDetail == Detail.tickets,
          key: const ValueKey<String>("TermsScreenWeb"),
        );
      case Detail.courses:
        return CoursesScreenWeb(
          refreshStream: _coursesRefreshStream.stream,
          showDialog: _showChildDialog,
          closeDialog: _closeChildDialog,
          key: const ValueKey<String>("CoursesScreenWeb"),
        );
      case Detail.assignments:
        return AssignmentsScreenWeb(
          refreshStream: _assignmentsRefreshStream.stream,
          closeDialog: _closeChildDialog,
          key: const ValueKey<String>("ModulesScreenWeb"),
        );
    }
  }

  void _showChildDialog({required Widget dialog}) {
    setState(() {
      _showDialog = true;
      _activeDialog = dialog;
    });
  }

  void _closeChildDialog() {
    setState(() {
      _showDialog = false;
    });
  }
}
