import "dart:async";

import "package:auto_route/auto_route.dart";
import "package:flutter/material.dart";
import "package:kilsar_core/kilsar_core.dart";

import "../../../services/AuthService/auth_service.dart";
import "../../../utilities/constants.dart";
import "../../routes/app_router.gr.dart";
import "../../theme/app_theme.dart";
import "../../theme/color_palette.dart";

@RoutePage()
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => SplashScreenState();
}

class SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    locator<AppTheme>().addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future<void>.delayed(splashScreenDuration).then((_) async {
        final bool loggedIn = await locator<AuthService>().restoreLoginState();
        if (!loggedIn) {
          if (!mounted) {
            return;
          }

          navigateToLogin();
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Image.asset(
            "lib/assets/images/splash.png",
            package: packageName,
            fit: BoxFit.cover,
          ),
          Center(
            child: Image.asset(
              "lib/assets/images/splashLogo.png",
              package: packageName,
              height: 44,
              color: ColorPalette.neutral50,
              fit: BoxFit.fitHeight,
            ),
          ),
        ],
      ),
    );
  }

  @protected
  void navigateToLogin() => context.router.popAndPush(LoginRoute());
}
