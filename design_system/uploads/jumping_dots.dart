import "package:flutter/material.dart";
import "package:jumping_dot/jumping_dot.dart";

class AnimatedColorJumpingDots extends StatefulWidget {
  const AnimatedColorJumpingDots({
    super.key,
    required this.baseColor,
    required this.innerPadding,
    required this.radius,
    required this.animationDuration,
    required this.verticalOffset,
  });
  final Color baseColor;
  final double innerPadding;
  final double radius;
  final Duration animationDuration;
  final double verticalOffset;

  @override
  State<AnimatedColorJumpingDots> createState() => _AnimatedColorJumpingDotsState();
}

class _AnimatedColorJumpingDotsState extends State<AnimatedColorJumpingDots> with SingleTickerProviderStateMixin {
  late AnimationController _colorController;
  late Animation<Color?> _colorAnimation;

  @override
  void initState() {
    super.initState();
    _colorController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _colorAnimation =
        ColorTween(
          begin: widget.baseColor.withValues(alpha: 0.3),
          end: widget.baseColor.withValues(alpha: 1.0),
        ).animate(
          CurvedAnimation(
            parent: _colorController,
            curve: Curves.easeInOut,
          ),
        );

    _colorController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _colorController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _colorAnimation,
      builder: (BuildContext context, Widget? child) {
        return JumpingDots(
          innerPadding: widget.innerPadding,
          color: _colorAnimation.value!,
          radius: widget.radius,
          animationDuration: widget.animationDuration,
          verticalOffset: widget.verticalOffset,
        );
      },
    );
  }
}
