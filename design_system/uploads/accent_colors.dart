import "package:flutter/material.dart";

class AccentColors extends ThemeExtension<AccentColors> {
  const AccentColors({
    this.accent1,
    this.accent2,
    this.accent3,
    this.accent4,
    this.accent5,
    this.accent6,
    this.accent7,
    this.accent8,
    this.accent9,
    this.accent10,
    this.accent11,
    this.accent12,
    this.accent13,
    this.accent14,
    this.accent15,
    this.accent16,
    this.accent17,
    this.accent18,
    this.accent19,
    this.accent20,
  });

  final Color? accent1;
  final Color? accent2;
  final Color? accent3;
  final Color? accent4;
  final Color? accent5;
  final Color? accent6;
  final Color? accent7;
  final Color? accent8;
  final Color? accent9;
  final Color? accent10;
  final Color? accent11;
  final Color? accent12;
  final Color? accent13;
  final Color? accent14;
  final Color? accent15;
  final Color? accent16;
  final Color? accent17;
  final Color? accent18;
  final Color? accent19;
  final Color? accent20;

  @override
  ThemeExtension<AccentColors> copyWith({
    Color? accent1,
    Color? accent2,
    Color? accent3,
    Color? accent4,
    Color? accent5,
    Color? accent6,
    Color? accent7,
    Color? accent8,
    Color? accent9,
    Color? accent10,
    Color? accent11,
    Color? accent12,
    Color? accent13,
    Color? accent14,
    Color? accent15,
    Color? accent16,
    Color? accent17,
    Color? accent18,
    Color? accent19,
    Color? accent20,
  }) {
    return AccentColors(
      accent1: accent1 ?? this.accent1,
      accent2: accent2 ?? this.accent2,
      accent3: accent3 ?? this.accent3,
      accent4: accent4 ?? this.accent4,
      accent5: accent5 ?? this.accent5,
      accent6: accent6 ?? this.accent6,
      accent7: accent7 ?? this.accent7,
      accent8: accent8 ?? this.accent8,
      accent9: accent9 ?? this.accent9,
      accent10: accent10 ?? this.accent10,
      accent11: accent11 ?? this.accent11,
      accent12: accent12 ?? this.accent12,
      accent13: accent13 ?? this.accent13,
      accent14: accent14 ?? this.accent14,
      accent15: accent15 ?? this.accent15,
      accent16: accent16 ?? this.accent16,
      accent17: accent17 ?? this.accent17,
      accent18: accent18 ?? this.accent18,
      accent19: accent19 ?? this.accent19,
      accent20: accent20 ?? this.accent20,
    );
  }

  @override
  ThemeExtension<AccentColors> lerp(AccentColors? other, double t) {
    if (other is! AccentColors) {
      return this;
    }

    return AccentColors(
      accent1: Color.lerp(accent1, other.accent1, t),
      accent2: Color.lerp(accent2, other.accent2, t),
      accent3: Color.lerp(accent3, other.accent3, t),
      accent4: Color.lerp(accent4, other.accent4, t),
      accent5: Color.lerp(accent5, other.accent5, t),
      accent6: Color.lerp(accent6, other.accent6, t),
      accent7: Color.lerp(accent7, other.accent7, t),
      accent8: Color.lerp(accent8, other.accent8, t),
      accent9: Color.lerp(accent9, other.accent9, t),
      accent10: Color.lerp(accent10, other.accent10, t),
      accent11: Color.lerp(accent11, other.accent11, t),
      accent12: Color.lerp(accent12, other.accent12, t),
      accent13: Color.lerp(accent13, other.accent13, t),
      accent14: Color.lerp(accent14, other.accent14, t),
      accent15: Color.lerp(accent15, other.accent15, t),
      accent16: Color.lerp(accent16, other.accent16, t),
      accent17: Color.lerp(accent17, other.accent17, t),
      accent18: Color.lerp(accent18, other.accent18, t),
      accent19: Color.lerp(accent19, other.accent19, t),
      accent20: Color.lerp(accent20, other.accent20, t),
    );
  }
}
