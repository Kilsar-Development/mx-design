import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_markdown_plus/flutter_markdown_plus.dart";
import "package:flutter_quill/flutter_quill.dart";
import "package:image_picker/image_picker.dart";
import "package:kilsar_core/kilsar_core.dart";
import "package:package_info_plus/package_info_plus.dart";
import "package:url_launcher/url_launcher.dart";

import "../../models/library_item.dart";
import "../../models/menu_option.dart";
import "../../utilities/constants.dart";
import "../theme/app_theme.dart";
import "alert_prompt.dart";

bool isWebOnMobile() {
  if (!kIsWeb) return false;

  return defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.android;
}

void showCannotDoThatOfflineSnackBar(BuildContext context) {
  showSnackBar(
    context,
    title: "Offline",
    message: "You cannot perform that action while offline. Please reconnect and try again.",
    isError: true,
  );
}

LinearGradient candyStripes({
  double opacity = 1,
  required BuildContext context,
  required Color color,
}) {
  final List<Color> colors = <Color>[
    color.withValues(alpha: opacity),
    color.withValues(alpha: opacity),
    context.colorScheme.onPrimary.withValues(alpha: opacity),
    context.colorScheme.onPrimary.withValues(alpha: opacity),
  ];

  return LinearGradient(
    begin: Alignment.topLeft,
    end: const Alignment(-0.4, -0.8),
    stops: const <double>[0.0, 0.5, 0.5, 1],
    colors: colors,
    tileMode: TileMode.repeated,
  );
}


String formatPrice(double price) {
  final NumberFormat usCurrency = NumberFormat("#,###.##", "en_US");
  return usCurrency.format(price);
}

Future<String> getVersionString() async {
  final PackageInfo packageInfo = await PackageInfo.fromPlatform();
  return packageInfo.version;
}

Widget comingSoonDialog(BuildContext context) {
  return AlertPrompt(
    title: "Coming Soon!",
    message: "That feature is coming soon.\n\nPlease stay tuned!",
    actions: <AlertAction>[
      AlertAction(label: "OK", onPressed: () => Navigator.of(context).pop()),
    ],
  );
}

ImageErrorWidgetBuilder errorImageBuilder({double size = 24, Color? color}) {
  Widget errorBuilder(BuildContext context, Object error, StackTrace? stackTrace) {
    return imageErrorWidget(
      context,
      size: size,
      color: color,
    );
  }

  return errorBuilder;
}

Widget imageErrorWidget(BuildContext context, {double size = 24, Color? color}) => Icon(
  Icons.image_outlined,
  size: size,
  color: color ?? context.colorScheme.tertiaryFixed,
);

List<BoxShadow> dropShadow(BuildContext context) => <BoxShadow>[
  BoxShadow(
    color: context.colorScheme.onSecondary.withValues(alpha: 0.2),
    blurRadius: 10,
    spreadRadius: 2,
  ),
];

Widget downRightArrow(BuildContext context, {Color? color}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Image.asset(
      "lib/assets/icons/downRightArrow.png",
      package: packageName,
      width: 24,
      height: 24,
      color: color,
    ),
  );
}

void showSnackBar(
  BuildContext context, {
  String title = "Success",
  String? message,
  bool isError = false,
  SnackBarAction? action,
}) {
  final double width = kIsWeb ? 540.0 : MediaQuery.of(context).size.width * 0.9;

  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      action: action,
      backgroundColor: context.colorScheme.tertiaryFixed,
      content: Row(
        children: <Widget>[
          Icon(
            isError ? Icons.error_outline : Icons.check_circle_outline,
            color: isError ? context.colorScheme.error : context.accentColors.accent1!,
            size: 32,
          ),
          const SizedBox(width: Sizing.med),
          SizedBox(
            width: width - 32 - Sizing.med - 2 * Sizing.small,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: message?.isEmpty ?? true ? MainAxisAlignment.center : MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(title, style: context.textTheme.labelLarge),
                if (message?.isNotEmpty ?? false)
                  Text(message!, style: context.textTheme.labelLarge, overflow: TextOverflow.ellipsis, maxLines: 2),
              ],
            ),
          ),
        ],
      ),
      duration: snackBarDuration,
      width: width,
      padding: const EdgeInsets.all(Sizing.small),
      behavior: SnackBarBehavior.floating,
      shape: const RoundedRectangleBorder(
        borderRadius: kIsWeb ? smBorderRadiusAll : medBorderRadiusAll,
      ),
    ),
  );
}

class LowerCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    return newValue.copyWith(text: newValue.text.toLowerCase());
  }
}

class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    return newValue.copyWith(text: newValue.text.toUpperCase());
  }
}

Future<void> openDocUrl(LibraryItem doc) async {
  if (!await launchUrl(Uri.parse(doc.file))) {
    Log.logger.e("Could not launch url: ${doc.file}");
  }
}

Future<DateTime?> showDatePickerDialog(
  BuildContext context, {
  DateTime? initialDate,
  required DateTime firstDate,
  required DateTime lastDate,
  DatePickerEntryMode initialEntryMode = DatePickerEntryMode.calendar,
}) async {
  return showDatePicker(
    context: context,
    initialDate: initialDate,
    firstDate: firstDate,
    lastDate: lastDate,
    initialEntryMode: initialEntryMode,
    builder: (BuildContext context, Widget? child) {
      return Theme(
        data: Theme.of(context).copyWith(
          dialogTheme: const DialogThemeData(shape: RoundedRectangleBorder(borderRadius: smBorderRadiusAll)),
          colorScheme: ColorScheme.light(
            primary: context.colorScheme.onSecondary,
            onSurface: context.colorScheme.onSecondary,
          ),
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              foregroundColor: context.colorScheme.onSecondary, // button text color
            ),
          ),
        ),
        child: child!,
      );
    },
  );
}

Widget imageSourceDialog(BuildContext context, {required Function(ImageSource) onImageSourceSelected}) {
  return Column(
    children: <Widget>[
      GestureDetector(
        onTap: () {
          Navigator.of(context).pop();
          onImageSourceSelected(ImageSource.camera);
        },
        behavior: HitTestBehavior.opaque,
        child: Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
          decoration: BoxDecoration(
            borderRadius: medBorderRadiusAll,
            color: context.colorScheme.onPrimary,
            border: Border.all(color: context.colorScheme.tertiary),
          ),
          child: Row(
            children: <Widget>[
              Image.asset(
                "lib/assets/icons/camera.png",
                package: packageName,
                width: 32,
                height: 32,
                color: context.colorScheme.primary,
              ),
              const SizedBox(width: Sizing.small),
              Text("Take photo", style: context.textTheme.labelLargeBold),
            ],
          ),
        ),
      ),
      const SizedBox(height: Sizing.small),
      GestureDetector(
        onTap: () {
          Navigator.of(context).pop();
          onImageSourceSelected(ImageSource.gallery);
        },
        behavior: HitTestBehavior.opaque,
        child: Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: Sizing.med),
          decoration: BoxDecoration(
            borderRadius: medBorderRadiusAll,
            color: context.colorScheme.onPrimary,
            border: Border.all(color: context.colorScheme.tertiary),
          ),
          child: Row(
            children: <Widget>[
              Image.asset(
                "lib/assets/icons/mountains.png",
                package: packageName,
                width: 32,
                height: 32,
                color: context.colorScheme.primary,
              ),
              const SizedBox(width: Sizing.small),
              Text("Choose from photos", style: context.textTheme.labelLargeBold),
            ],
          ),
        ),
      ),
    ],
  );
}

Future<void> showContextMenu(
  BuildContext context, {
  required Offset position,
  required List<MenuOption> options,
  bool light = true,
}) async {
  final RenderBox overlay = Overlay.of(context).context.findRenderObject()! as RenderBox;

  final int? menuItemIndex = await showMenu<int>(
    context: context,
    shape: const RoundedRectangleBorder(borderRadius: smBorderRadiusAll),
    color: light ? context.colorScheme.onPrimary : context.colorScheme.onSecondary,
    shadowColor: context.colorScheme.onSecondary,
    items: options
        .asMap()
        .entries
        .map(
          (MapEntry<int, MenuOption> entry) => PopupMenuItem<int>(
            value: entry.key,
            textStyle: context.textTheme.labelMediumSemiBold,
            padding: EdgeInsets.zero,
            child: StatefulBuilder(
              builder: (BuildContext context, Function(void Function()) setState) {
                return MouseRegion(
                  child: Container(
                    height: 52,
                    decoration: const BoxDecoration(borderRadius: smBorderRadiusAll),
                    padding: const EdgeInsets.symmetric(horizontal: Sizing.small),
                    child: Row(
                      children: <Widget>[
                        if (entry.value.leadingWidget != null) entry.value.leadingWidget!,
                        if (entry.value.leadingIcon != null)
                          Icon(
                            entry.value.leadingIcon,
                            color: entry.value.isEnabled
                                ? (entry.value.isDestructive
                                      ? context.colorScheme.error
                                      : (entry.value.iconColor ??
                                            (light ? context.colorScheme.onSecondary : context.colorScheme.onPrimary)))
                                : (light ? context.colorScheme.tertiaryFixed : context.accentColors.accent7),
                          ),
                        const SizedBox(width: Sizing.xSmall),
                        Text(
                          entry.value.label,
                          style: context.textTheme.labelMediumSemiBold.copyWith(
                            color: entry.value.isEnabled
                                ? (entry.value.isDestructive
                                      ? context.colorScheme.error
                                      : (light ? context.colorScheme.onSecondary : context.colorScheme.onPrimary))
                                : (light ? context.colorScheme.tertiaryFixed : context.accentColors.accent7),
                          ),
                        ),
                        if (entry.value.trailingIcon != null)
                          Padding(
                            padding: const EdgeInsets.only(left: Sizing.xSmall),
                            child: Icon(
                              entry.value.trailingIcon,
                              color: entry.value.isEnabled
                                  ? (entry.value.isDestructive
                                        ? context.colorScheme.error
                                        : (entry.value.iconColor ??
                                              (light
                                                  ? context.colorScheme.onSecondary
                                                  : context.colorScheme.onPrimary)))
                                  : (light ? context.colorScheme.tertiaryFixed : context.accentColors.accent7),
                            ),
                          ),
                        if (entry.value.trailingWidget != null) entry.value.trailingWidget!,
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        )
        .toList(),
    position: RelativeRect.fromSize(position & Size.zero, overlay.size),
  );

  if (menuItemIndex == null) {
    return;
  }

  options[menuItemIndex].handler?.call();
}

DefaultStyles commonQuillStyle(BuildContext context, {TextStyle? placeholderStyle, TextStyle? textStyle}) {
  return DefaultStyles(
    placeHolder: DefaultTextBlockStyle(
      placeholderStyle ??
          context.textTheme.labelLarge.copyWith(
            color: context.colorScheme.primaryFixed,
          ),
      HorizontalSpacing.zero,
      VerticalSpacing.zero,
      VerticalSpacing.zero,
      null,
    ),
    paragraph: DefaultTextBlockStyle(
      textStyle ?? context.textTheme.labelLarge,
      HorizontalSpacing.zero,
      VerticalSpacing.zero,
      VerticalSpacing.zero,
      null,
    ),
    lists: DefaultListBlockStyle(
      textStyle ?? context.textTheme.labelLarge,
      HorizontalSpacing.zero,
      VerticalSpacing.zero,
      VerticalSpacing.zero,
      null,
      null,
    ),
    leading: DefaultTextBlockStyle(
      textStyle ?? context.textTheme.labelMediumSemiBold,
      HorizontalSpacing.zero,
      VerticalSpacing.zero,
      VerticalSpacing.zero,
      null,
    ),
    superscript: context.textTheme.labelMediumSemiBold,
    subscript: context.textTheme.labelMediumSemiBold,
  );
}

QuillSimpleToolbarConfig commonQuillConfig(BuildContext context) => QuillSimpleToolbarConfig(
  buttonOptions: QuillSimpleToolbarButtonOptions(
    base: QuillToolbarBaseButtonOptions<dynamic, dynamic>(
      iconSize: 20,
      iconButtonFactor: 1,
      iconTheme: QuillIconTheme(
        iconButtonUnselectedData: IconButtonData(
          padding: EdgeInsets.zero,
          visualDensity: VisualDensity.compact,
          color: context.colorScheme.primaryFixed,
        ),
      ),
    ),
  ),
  toolbarSectionSpacing: 0,
  showColorButton: false,
  showFontFamily: false,
  showFontSize: false,
  showBackgroundColorButton: false,
  showInlineCode: false,
  showListCheck: false,
  showDividers: false,
  showQuote: false,
  showRedo: false,
  showUndo: false,
  showCodeBlock: false,
  showIndent: false,
  showClearFormat: false,
  showLeftAlignment: false,
  showCenterAlignment: false,
  showRightAlignment: false,
  showLink: false,
  showHeaderStyle: false,
  showSearchButton: false,
);

MarkdownStyleSheet commonMarkdownStyleSheet(BuildContext context) => MarkdownStyleSheet(
  h1: context.textTheme.h1,
  h2: context.textTheme.h2,
  h3: context.textTheme.h3,
  h4: context.textTheme.h4,
  h5: context.textTheme.h5,
  p: context.textTheme.bodySmall,
  listBullet: context.textTheme.bodySmall,
  strong: context.textTheme.bodyLargeBold, // TODOnot currently working
  tableBody: context.textTheme.bodySmall,
  tableHead: context.textTheme.bodySmall,
);

Widget publicPrivateWidget({required BuildContext context, required bool isPrivate, bool colored = true}) {
  if (isPrivate) {
    return Row(
      children: <Widget>[
        Icon(
          Icons.lock_outlined,
          color: colored ? context.colorScheme.error : context.colorScheme.onSurfaceVariant,
          size: 16,
        ),
        const SizedBox(
          width: Sizing.xSmall,
        ),
        Text(
          "Private",
          style: context.textTheme.labelMediumMedium.copyWith(
            color: colored ? context.colorScheme.error : context.colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }

  return Row(
    children: <Widget>[
      Icon(
        Icons.lock_open_outlined,
        color: colored ? context.accentColors.accent6! : context.colorScheme.onSurfaceVariant,
        size: 16,
      ),
      const SizedBox(
        width: Sizing.xSmall,
      ),
      Text(
        "Public",
        style: context.textTheme.labelMediumMedium.copyWith(
          color: colored ? context.accentColors.accent6! : context.colorScheme.onSurfaceVariant,
        ),
      ),
    ],
  );
}

Widget deleteIcon(BuildContext context) {
  return Image.asset(
    "lib/assets/icons/trash.png",
    package: packageName,
    width: 20,
    height: 20,
    color: context.colorScheme.error,
  );
}
