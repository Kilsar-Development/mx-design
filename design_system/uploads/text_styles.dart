import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";

import "size_class.dart";

class TextThemeExt extends ThemeExtension<TextThemeExt> {
  TextThemeExt({required Color defaultColor}) : _defaultColor = defaultColor;

  static final TextStyle plusJakartaSans = GoogleFonts.plusJakartaSans();

  final Color _defaultColor;

  SizeClass _sizeClass = SizeClass.desktop;
  TextThemeExt updateSizeClass(BuildContext context) {
    _sizeClass = context.sizeClass;
    return this;
  }

  TextStyle get h1 => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 32,
      SizeClass.desktop => 32,
      SizeClass.tablet => 28,
      SizeClass.mobile => 28,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w400,
      SizeClass.desktop => FontWeight.w400,
      SizeClass.tablet => FontWeight.w700,
      SizeClass.mobile => FontWeight.w700,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get h2 => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 28,
      SizeClass.desktop => 28,
      SizeClass.tablet => 24,
      SizeClass.mobile => 24,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get h3 => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 25,
      SizeClass.desktop => 25,
      SizeClass.tablet => 20,
      SizeClass.mobile => 20,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get h4 => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 22,
      SizeClass.desktop => 22,
      SizeClass.tablet => 18,
      SizeClass.mobile => 18,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get h5 => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 20,
      SizeClass.desktop => 20,
      SizeClass.tablet => 16,
      SizeClass.mobile => 16,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w400,
      SizeClass.desktop => FontWeight.w400,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get subtitleLarge => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 18,
      SizeClass.desktop => 18,
      SizeClass.tablet => 18,
      SizeClass.mobile => 18,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w400,
      SizeClass.desktop => FontWeight.w400,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get subtitleLargeBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 18,
      SizeClass.desktop => 18,
      SizeClass.tablet => 18,
      SizeClass.mobile => 18,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w700,
      SizeClass.desktop => FontWeight.w700,
      SizeClass.tablet => FontWeight.w700,
      SizeClass.mobile => FontWeight.w700,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get subtitleSmall => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 16,
      SizeClass.desktop => 16,
      SizeClass.tablet => 16,
      SizeClass.mobile => 16,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get navigation => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 10,
      SizeClass.mobile => 10,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get bodyLarge => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 16,
      SizeClass.desktop => 16,
      SizeClass.tablet => 16,
      SizeClass.mobile => 16,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get bodyLargeSemiBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 16,
      SizeClass.desktop => 16,
      SizeClass.tablet => 16,
      SizeClass.mobile => 16,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get bodyLargeBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 16,
      SizeClass.desktop => 16,
      SizeClass.tablet => 16,
      SizeClass.mobile => 16,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w700,
      SizeClass.desktop => FontWeight.w700,
      SizeClass.tablet => FontWeight.w700,
      SizeClass.mobile => FontWeight.w700,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get bodySmall => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 16,
      SizeClass.desktop => 16,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelLargeBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w700,
      SizeClass.desktop => FontWeight.w700,
      SizeClass.tablet => FontWeight.w700,
      SizeClass.mobile => FontWeight.w700,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelLargeRegular => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w400,
      SizeClass.mobile => FontWeight.w400,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelLarge => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelLargeSemiBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get filters => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 14,
      SizeClass.desktop => 14,
      SizeClass.tablet => 14,
      SizeClass.mobile => 14,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelMediumRegular => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 12,
      SizeClass.desktop => 12,
      SizeClass.tablet => 12,
      SizeClass.mobile => 12,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w400,
      SizeClass.mobile => FontWeight.w400,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelMediumMedium => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 12,
      SizeClass.desktop => 12,
      SizeClass.tablet => 12,
      SizeClass.mobile => 12,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelMediumSemiBold => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 12,
      SizeClass.desktop => 12,
      SizeClass.tablet => 12,
      SizeClass.mobile => 12,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelSmall => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 10,
      SizeClass.desktop => 10,
      SizeClass.tablet => 10,
      SizeClass.mobile => 10,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w600,
      SizeClass.desktop => FontWeight.w600,
      SizeClass.tablet => FontWeight.w600,
      SizeClass.mobile => FontWeight.w600,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  TextStyle get labelTiny => TextStyle(
    fontSize: switch (_sizeClass) {
      SizeClass.desktopXL => 8,
      SizeClass.desktop => 8,
      SizeClass.tablet => 8,
      SizeClass.mobile => 8,
    },
    fontWeight: switch (_sizeClass) {
      SizeClass.desktopXL => FontWeight.w500,
      SizeClass.desktop => FontWeight.w500,
      SizeClass.tablet => FontWeight.w500,
      SizeClass.mobile => FontWeight.w500,
    },
    fontStyle: plusJakartaSans.fontStyle,
    fontFamily: plusJakartaSans.fontFamily,
    color: _defaultColor,
  );

  @override
  ThemeExtension<TextThemeExt> copyWith() => this;

  @override
  ThemeExtension<TextThemeExt> lerp(covariant ThemeExtension<TextThemeExt>? other, double t) => this;
}
