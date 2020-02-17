import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:ulink_mobile_flutter/shared/app_config.dart';
import 'package:ulink_mobile_flutter/tabs/info_about.dart';
import 'package:ulink_mobile_flutter/tabs/links_create.dart';
import 'package:ulink_mobile_flutter/tabs/links_display.dart';
import 'package:ulink_mobile_flutter/shared/api_login.dart';
import 'package:flutter/services.dart';

class LinkShortenerApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    // This app is designed only to work vertically, so we limit
    // orientations to portrait up and down.
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);

    return CupertinoApp(
      localizationsDelegates: const <LocalizationsDelegate<dynamic>>[
        DefaultMaterialLocalizations.delegate,
        DefaultWidgetsLocalizations.delegate,
      ],
      title: "uLINK.no URL Shortener",
      home: LinkShortenerAppHome(),
    );
  }
}

class LinkShortenerAppHome extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    var deviceType = (Theme.of(context).platform == TargetPlatform.iOS)?"ios":"android";
    ApiLogin.loadAppToken(deviceType);

    return Scaffold(
      // Appbar
      appBar: AppBar(
        leading: Image.asset('images/logo_icon.png'),
        // Title
        title: Text("uLINK.no :: shorten & simplify"),
        // Set the background color of the App Bar
        backgroundColor: Colors.orangeAccent,
      ),
      body: CupertinoTabScaffold(
        tabBar: CupertinoTabBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.transform, size: 44.0),//(CupertinoIcons.add),
              //title: Text('Link'),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.link, size: 44.0),
              //title: Text('Links'),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.info, size: 44.0),
              //title: Text('Info'),
            ),
          ],
        ),
        tabBuilder: (context, index) {
          var tabView;
          switch (index) {
            case 0:
              tabView = CupertinoTabView(builder: (context) {
                return CupertinoPageScaffold(
                  child: LinksCreate(),
                );
              });
              break;
            case 1:
              tabView = CupertinoTabView(builder: (context) {
                return CupertinoPageScaffold(
                  child: LinksDisplay(),
                );
              });
              break;
            case 2:
              tabView = CupertinoTabView(builder: (context) {
                return CupertinoPageScaffold(
                  child: InfoAbout(),
                );
              });
              break;
          }
          return tabView;
        },
      ),
    );
  }
}
