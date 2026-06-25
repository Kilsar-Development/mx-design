import "package:collection/collection.dart";
import "package:flutter/material.dart";
import "package:kilsar_core/kilsar_core.dart";

import "../../utilities/constants.dart";
import "accent_colors.dart";
import "color_palette.dart";
import "text_styles.dart";

export "../../utilities/theme_getters.dart";

extension ThemeModeExt on ThemeMode {
  static ThemeMode? fromString(String? value) =>
      ThemeMode.values.firstWhereOrNull((ThemeMode mode) => mode.name == value);
}

class AppTheme with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  set themeMode(ThemeMode themeMode) {
    _themeMode = themeMode;
    locator<StorageService>().write(THEME_MODE, _themeMode.name);
    notifyListeners();
  }

  bool isDarkMode(BuildContext context) => switch (_themeMode) {
    ThemeMode.dark => true,
    ThemeMode.light => false,
    ThemeMode.system => Theme.of(context).brightness == Brightness.dark,
  };

  Future<void> refreshThemeMode() async {
    // if the user has specifically set it, use it, otherwise use system

    final ThemeMode? userSetThemeMode = ThemeModeExt.fromString(await locator<StorageService>().read(THEME_MODE));
    if (userSetThemeMode == null) {
      // they have never set it, so no-op
      return;
    }

    _themeMode = userSetThemeMode;
    notifyListeners();
  }

  static final ThemeData lightThemeData = ThemeData.light().copyWith(
    colorScheme: lightColorScheme,
    hintColor: lightColorScheme.onSurfaceVariant,
    // ignore: deprecated_member_use
    scaffoldBackgroundColor: lightColorScheme.surfaceVariant,
    splashFactory: NoSplash.splashFactory,
    splashColor: Colors.transparent,
    highlightColor: Colors.transparent,
    hoverColor: Colors.transparent,
    focusColor: lightColorScheme.tertiary,
    appBarTheme: const AppBarTheme().copyWith(
      scrolledUnderElevation: 0.0,
      // ignore: deprecated_member_use
      backgroundColor: lightColorScheme.surfaceVariant,
      foregroundColor: lightColorScheme.onSurface,
      elevation: 0,
      titleTextStyle: TextThemeExt(defaultColor: lightColorScheme.onSurface).h5,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: lightColorScheme.primaryContainer,
      modalBackgroundColor: lightColorScheme.primaryContainer,
      surfaceTintColor: lightColorScheme.primaryContainer,
      dragHandleColor: lightColorScheme.onSurfaceVariant,
      showDragHandle: false,
      clipBehavior: Clip.antiAlias,
    ),
    checkboxTheme: const CheckboxThemeData().copyWith(
      side: WidgetStateBorderSide.resolveWith(
        (_) => BorderSide(color: lightColorScheme.onSurfaceVariant),
      ),
      fillColor: WidgetStateProperty.all<Color>(Colors.transparent),
      checkColor: WidgetStateProperty.all<Color>(ColorPalette.green200),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
      splashRadius: 0,
    ),
    radioTheme: const RadioThemeData().copyWith(splashRadius: 0),
    inputDecorationTheme: const InputDecorationTheme(
      border: InputBorder.none,
      focusedBorder: InputBorder.none,
      enabledBorder: InputBorder.none,
    ),
    expansionTileTheme: const ExpansionTileThemeData(
      tilePadding: EdgeInsets.zero,
      childrenPadding: EdgeInsets.zero,
      shape: RoundedRectangleBorder(),
    ),
    listTileTheme: const ListTileThemeData(minVerticalPadding: 0),
    menuTheme: MenuThemeData(
      style: MenuStyle(
        surfaceTintColor: WidgetStatePropertyAll<Color>(lightColorScheme.surface),
        shadowColor: WidgetStatePropertyAll<Color>(lightColorScheme.onSecondary),
        padding: const WidgetStatePropertyAll<EdgeInsetsGeometry?>(
          EdgeInsets.only(
            top: Sizing.small,
            bottom: Sizing.small,
            left: Sizing.xSmall,
            right: Sizing.xSmall,
          ),
        ),
      ),
    ),
    sliderTheme: SliderThemeData(
      trackHeight: 3,
      activeTrackColor: lightColorScheme.primary,
      inactiveTrackColor: lightColorScheme.tertiary,
      thumbColor: lightColorScheme.primary,
      thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 4),
      overlayShape: const RoundSliderOverlayShape(overlayRadius: Sizing.small),
      // valueIndicatorColor: lightColorScheme.secondary,
      // valueIndicatorTextStyle: context.textTheme.labelLarge.copyWith(color: lightColorScheme.onSecondary),
    ),
    extensions: <ThemeExtension<dynamic>>[
      TextThemeExt(defaultColor: ColorPalette.neutral900),
      const AccentColors(
        accent1: ColorPalette.green200,
        accent2: ColorPalette.green50,
        accent3: ColorPalette.green600,
        accent4: ColorPalette.orange300,
        accent5: ColorPalette.orange50,
        accent6: ColorPalette.orange100,
        accent7: ColorPalette.blue300,
        accent8: ColorPalette.blue50,
        accent9: ColorPalette.blue200,
        // accent10: ColorPalette.water, // TODO need to update/convert usage
        // accent11: ColorPalette.mistyRose,
        accent12: ColorPalette.purple200,
        accent13: ColorPalette.purple50,
        accent14: ColorPalette.red50,
        accent15: ColorPalette.red600,
        accent16: ColorPalette.red200,
      ),
    ],
  );

  static final ThemeData darkThemeData = lightThemeData.copyWith(
    colorScheme: darkColorScheme,
    hintColor: darkColorScheme.onSurfaceVariant,
    // ignore: deprecated_member_use
    scaffoldBackgroundColor: darkColorScheme.surfaceVariant,
    splashFactory: NoSplash.splashFactory,
    splashColor: Colors.transparent,
    highlightColor: Colors.transparent,
    hoverColor: Colors.transparent,
    focusColor: Colors.transparent,
    appBarTheme: const AppBarTheme().copyWith(
      scrolledUnderElevation: 0.0,
      // ignore: deprecated_member_use
      backgroundColor: darkColorScheme.surfaceVariant,
      foregroundColor: darkColorScheme.onSurface,
      elevation: 0,
      titleTextStyle: TextThemeExt(defaultColor: darkColorScheme.onSurface).h5,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: darkColorScheme.primaryContainer,
      modalBackgroundColor: darkColorScheme.primaryContainer,
      surfaceTintColor: darkColorScheme.primaryContainer,
      dragHandleColor: darkColorScheme.onSurfaceVariant,
      showDragHandle: false,
      clipBehavior: Clip.antiAlias,
    ),
    checkboxTheme: const CheckboxThemeData().copyWith(
      side: WidgetStateBorderSide.resolveWith(
        (_) => BorderSide(color: darkColorScheme.onSurfaceVariant),
      ),
      fillColor: WidgetStateProperty.all<Color>(Colors.transparent),
      checkColor: WidgetStateProperty.all<Color>(ColorPalette.green300),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
      splashRadius: 0,
    ),
    radioTheme: const RadioThemeData().copyWith(splashRadius: 0),
    inputDecorationTheme: const InputDecorationTheme(
      border: InputBorder.none,
      focusedBorder: InputBorder.none,
      enabledBorder: InputBorder.none,
    ),
    expansionTileTheme: const ExpansionTileThemeData(
      tilePadding: EdgeInsets.zero,
      childrenPadding: EdgeInsets.zero,
      shape: RoundedRectangleBorder(),
    ),
    listTileTheme: const ListTileThemeData(minVerticalPadding: 0),
    menuTheme: MenuThemeData(
      style: MenuStyle(
        surfaceTintColor: WidgetStatePropertyAll<Color>(darkColorScheme.surface),
        shadowColor: WidgetStatePropertyAll<Color>(darkColorScheme.onSecondary),
        padding: const WidgetStatePropertyAll<EdgeInsetsGeometry?>(
          EdgeInsets.only(
            top: Sizing.small,
            bottom: Sizing.small,
            left: Sizing.xSmall,
            right: Sizing.xSmall,
          ),
        ),
      ),
    ),
    sliderTheme: SliderThemeData(
      trackHeight: 3,
      activeTrackColor: darkColorScheme.primary,
      inactiveTrackColor: darkColorScheme.tertiary,
      thumbColor: darkColorScheme.primary,
      thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 4),
      overlayShape: const RoundSliderOverlayShape(overlayRadius: Sizing.small),
      // valueIndicatorColor: lightColorScheme.secondary,
      // valueIndicatorTextStyle: context.textTheme.labelLarge.copyWith(color: lightColorScheme.onSecondary),
    ),
    extensions: <ThemeExtension<dynamic>>[
      TextThemeExt(defaultColor: ColorPalette.neutral50),
      const AccentColors(
        accent1: ColorPalette.green300,
        accent2: ColorPalette.green700,
        accent3: ColorPalette.green100,
        accent4: ColorPalette.orange400,
        accent5: ColorPalette.orange700,
        accent6: ColorPalette.orange200,
        accent7: ColorPalette.blue500,
        accent8: ColorPalette.blue500,
        accent9: ColorPalette.blue100,
        // accent10: ColorPalette.water,
        // accent11: ColorPalette.mistyRose,
        accent12: ColorPalette.purple300,
        accent13: ColorPalette.purple700,
        accent14: ColorPalette.red700,
        accent15: ColorPalette.red100,
        accent16: ColorPalette.red200,
      ),
    ],
  );

  static ColorScheme lightColorScheme = const ColorScheme(
    primary: ColorPalette.black,
    onPrimary: ColorPalette.neutral100,
    primaryContainer: ColorPalette.neutral50,
    onPrimaryContainer: ColorPalette.neutral800,
    secondary: ColorPalette.neutral200,
    onSecondary: ColorPalette.neutral950,
    secondaryContainer: ColorPalette.neutral50,
    onSecondaryContainer: ColorPalette.neutral950,
    tertiary: ColorPalette.neutral100,
    onTertiary: ColorPalette.neutral500,
    tertiaryContainer: ColorPalette.neutral200,
    onTertiaryContainer: ColorPalette.neutral950,
    error: ColorPalette.red300,
    onError: ColorPalette.neutral50,
    errorContainer: ColorPalette.red50,
    onErrorContainer: ColorPalette.red100,
    surface: ColorPalette.white,
    onSurface: ColorPalette.neutral900,
    onSurfaceVariant: ColorPalette.neutral500,
    outline: ColorPalette.neutral200,
    outlineVariant: ColorPalette.neutral100,
    shadow: ColorPalette.black,
    scrim: ColorPalette.transparent40,
    inverseSurface: ColorPalette.neutral800,
    onInverseSurface: ColorPalette.neutral50,
    // ignore: deprecated_member_use
    surfaceVariant: ColorPalette.neutral50,
    surfaceContainerLowest: ColorPalette.neutral50,
    surfaceContainerLow: ColorPalette.neutral200,
    surfaceContainer: ColorPalette.neutral400,
    surfaceContainerHigh: ColorPalette.neutral500,
    surfaceContainerHighest: ColorPalette.neutral700,

    brightness: Brightness.light,
  );

  static ColorScheme darkColorScheme = const ColorScheme(
    primary: ColorPalette.white,
    onPrimary: ColorPalette.neutral950,
    primaryContainer: ColorPalette.neutral800,
    onPrimaryContainer: ColorPalette.neutral50,
    secondary: ColorPalette.neutral700,
    onSecondary: ColorPalette.neutral50,
    secondaryContainer: ColorPalette.neutral800,
    onSecondaryContainer: ColorPalette.neutral50,
    tertiary: ColorPalette.neutral700,
    onTertiary: ColorPalette.neutral500,
    tertiaryContainer: ColorPalette.neutral650,
    onTertiaryContainer: ColorPalette.neutral50,
    error: ColorPalette.red400,
    onError: ColorPalette.neutral50,
    errorContainer: ColorPalette.red700,
    onErrorContainer: ColorPalette.red200,
    surface: ColorPalette.neutral800,
    onSurface: ColorPalette.neutral50,
    onSurfaceVariant: ColorPalette.neutral500,
    outline: ColorPalette.neutral600,
    outlineVariant: ColorPalette.neutral700,
    shadow: ColorPalette.black,
    scrim: ColorPalette.transparent60,
    inverseSurface: ColorPalette.neutral50,
    onInverseSurface: ColorPalette.neutral950,
    // ignore: deprecated_member_use
    surfaceVariant: ColorPalette.neutral950,
    surfaceContainerLowest: ColorPalette.neutral700,
    surfaceContainerLow: ColorPalette.neutral600,
    surfaceContainer: ColorPalette.neutral500,
    surfaceContainerHigh: ColorPalette.neutral400,
    surfaceContainerHighest: ColorPalette.neutral300,

    brightness: Brightness.dark,
  );
}

extension ThemeGetter on BuildContext {
  // theme, colorScheme, accentColors are defined in utilities/theme_getters.dart
  // so they're available to all layers (including models for ColorMixin).
  // textTheme stays here because it depends on TextThemeExt which is UI-layer.
  TextThemeExt get textTheme => Theme.of(this).extension<TextThemeExt>()!.updateSizeClass(this);
}
