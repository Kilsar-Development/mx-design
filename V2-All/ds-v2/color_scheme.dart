// Mx Design System V2 — color_palette.dart + color_scheme.dart
// Only Flutter ColorScheme members are used. Attention (amber) is AccentColors accent1..4.
import 'package:flutter/material.dart';

/// Fixed primitives. Nothing outside this class may hold a hex literal.
class ColorPalette {
  static const neutral0 = Color(0xFFFFFFFF);
  static const neutral50 = Color(0xFFF7F7F5);
  static const neutral100 = Color(0xFFEFEFEC);
  static const neutral200 = Color(0xFFE2E2DE);
  static const neutral300 = Color(0xFFCBCCC7);
  static const neutral400 = Color(0xFF9A9EA4);
  static const neutral500 = Color(0xFF6F747B);
  static const neutral600 = Color(0xFF5A5F66);
  static const neutral700 = Color(0xFF3A3D42);
  static const neutral800 = Color(0xFF24272B);
  static const neutral900 = Color(0xFF1B1D20);
  static const neutral950 = Color(0xFF121315);
  static const neutral1000 = Color(0xFF000000);
  static const teal50 = Color(0xFFEDF8F6);
  static const teal100 = Color(0xFFDDF3F0);
  static const teal200 = Color(0xFFA8E5DC);
  static const teal300 = Color(0xFF5EEAD4);
  static const teal400 = Color(0xFF2DBFA9);
  static const teal500 = Color(0xFF14968A);
  static const teal600 = Color(0xFF0F766E);
  static const teal700 = Color(0xFF0B5A54);
  static const teal800 = Color(0xFF123532);
  static const teal900 = Color(0xFF0A2321);
  static const amber50 = Color(0xFFFDF6E7);
  static const amber100 = Color(0xFFFDF0DC);
  static const amber200 = Color(0xFFFCD264);
  static const amber300 = Color(0xFFFBBF24);
  static const amber400 = Color(0xFFF59E0B);
  static const amber500 = Color(0xFFD97706);
  static const amber600 = Color(0xFFB45309);
  static const amber700 = Color(0xFF9A5200);
  static const amber800 = Color(0xFF3A2A0A);
  static const amber900 = Color(0xFF2A1D05);
  static const red50 = Color(0xFFFEF2F2);
  static const red100 = Color(0xFFFECACA);
  static const red200 = Color(0xFFF87171);
  static const red300 = Color(0xFFEF4444);
  static const red500 = Color(0xFFDC2626);
  static const red700 = Color(0xFF991B1B);
  static const red800 = Color(0xFF450A0A);
  static const red900 = Color(0xFF2C0606);
  static const transparent40 = Color(0x66000000);
  static const transparent60 = Color(0x99000000);
}

const ColorScheme lightColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: ColorPalette.teal600,
  onPrimary: ColorPalette.neutral0,
  primaryContainer: ColorPalette.teal100,
  onPrimaryContainer: ColorPalette.teal700,
  inversePrimary: ColorPalette.teal300,
  surfaceTint: ColorPalette.teal600,
  secondary: ColorPalette.neutral100,
  onSecondary: ColorPalette.neutral900,
  secondaryContainer: ColorPalette.neutral100,
  onSecondaryContainer: ColorPalette.neutral900,
  tertiary: ColorPalette.neutral100,
  onTertiary: ColorPalette.neutral600,
  tertiaryContainer: ColorPalette.neutral200,
  onTertiaryContainer: ColorPalette.neutral900,
  error: ColorPalette.red500,
  onError: ColorPalette.neutral0,
  errorContainer: ColorPalette.red50,
  onErrorContainer: ColorPalette.red700,
  surface: ColorPalette.neutral0,
  onSurface: ColorPalette.neutral900,
  onSurfaceVariant: ColorPalette.neutral600,
  surfaceDim: ColorPalette.neutral200,
  surfaceBright: ColorPalette.neutral0,
  surfaceContainerLowest: ColorPalette.neutral0,
  surfaceContainerLow: ColorPalette.neutral50,
  surfaceContainer: ColorPalette.neutral100,
  surfaceContainerHigh: ColorPalette.neutral200,
  surfaceContainerHighest: ColorPalette.neutral300,
  outline: ColorPalette.neutral200,
  outlineVariant: ColorPalette.neutral100,
  inverseSurface: ColorPalette.neutral800,
  onInverseSurface: ColorPalette.neutral50,
  shadow: ColorPalette.neutral1000,
  scrim: ColorPalette.transparent40,
);

const ColorScheme darkColorScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: ColorPalette.teal300,
  onPrimary: ColorPalette.teal900,
  primaryContainer: ColorPalette.teal800,
  onPrimaryContainer: ColorPalette.teal200,
  inversePrimary: ColorPalette.teal600,
  surfaceTint: ColorPalette.teal300,
  secondary: ColorPalette.neutral800,
  onSecondary: ColorPalette.neutral50,
  secondaryContainer: ColorPalette.neutral800,
  onSecondaryContainer: ColorPalette.neutral50,
  tertiary: ColorPalette.neutral800,
  onTertiary: ColorPalette.neutral400,
  tertiaryContainer: ColorPalette.neutral700,
  onTertiaryContainer: ColorPalette.neutral50,
  error: ColorPalette.red200,
  onError: ColorPalette.red900,
  errorContainer: ColorPalette.red800,
  onErrorContainer: ColorPalette.red100,
  surface: ColorPalette.neutral900,
  onSurface: ColorPalette.neutral50,
  onSurfaceVariant: ColorPalette.neutral400,
  surfaceDim: ColorPalette.neutral950,
  surfaceBright: ColorPalette.neutral800,
  surfaceContainerLowest: ColorPalette.neutral950,
  surfaceContainerLow: ColorPalette.neutral950,
  surfaceContainer: ColorPalette.neutral800,
  surfaceContainerHigh: ColorPalette.neutral700,
  surfaceContainerHighest: ColorPalette.neutral600,
  outline: ColorPalette.neutral700,
  outlineVariant: ColorPalette.neutral800,
  inverseSurface: ColorPalette.neutral50,
  onInverseSurface: ColorPalette.neutral950,
  shadow: ColorPalette.neutral1000,
  scrim: ColorPalette.transparent60,
);

/// AccentColors: one token per widget role, resolved per brightness.
/// accent1 attention · accent2 onAttention · accent3 attentionContainer · accent4 onAttentionContainer
class AccentColors extends ThemeExtension<AccentColors> {
  const AccentColors({required this.accent1, required this.accent2, required this.accent3, required this.accent4});
  final Color accent1, accent2, accent3, accent4;

  static const light = AccentColors(
    accent1: ColorPalette.amber500,
    accent2: ColorPalette.neutral0,
    accent3: ColorPalette.amber100,
    accent4: ColorPalette.amber700,
  );
  static const dark = AccentColors(
    accent1: ColorPalette.amber300,
    accent2: ColorPalette.amber900,
    accent3: ColorPalette.amber800,
    accent4: ColorPalette.amber200,
  );

  @override
  AccentColors copyWith({Color? accent1, Color? accent2, Color? accent3, Color? accent4}) => AccentColors(
    accent1: accent1 ?? this.accent1, accent2: accent2 ?? this.accent2, accent3: accent3 ?? this.accent3, accent4: accent4 ?? this.accent4);

  @override
  AccentColors lerp(AccentColors? o, double t) => o == null ? this : AccentColors(
    accent1: Color.lerp(accent1, o.accent1, t)!, accent2: Color.lerp(accent2, o.accent2, t)!,
    accent3: Color.lerp(accent3, o.accent3, t)!, accent4: Color.lerp(accent4, o.accent4, t)!);
}
