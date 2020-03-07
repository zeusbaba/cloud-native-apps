import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:ulink_mobile/views/info_display.dart';
import 'package:ulink_mobile/views/links_create.dart';
import 'package:ulink_mobile/views/links_display.dart';
import 'package:ulink_mobile/shared/api_login.dart';
import 'package:flutter/services.dart';

void main() => runApp(LinkShortenerApp());

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
      theme: CupertinoThemeData(
        brightness: Brightness.light,
        primaryColor: Colors.deepOrange,
        primaryContrastingColor: Colors.deepOrangeAccent,
        barBackgroundColor: Colors.deepOrangeAccent,
        scaffoldBackgroundColor: Colors.white
      ),
      title: "uLINK.no URL Shortener",
      home: LinkShortenerAppHome(),
    );
  }
}

final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
class LinkShortenerAppHome extends StatelessWidget {
  LinkShortenerAppHome({Key key}) : super(key: key);

  _displayInfoDialog(context) {
    showDialog(
        context: context,
        builder: (context) => InfoDisplayDialog()
    );
  }

  @override
  Widget build(BuildContext context) {
    var deviceType = (Theme.of(context).platform == TargetPlatform.iOS)?"ios":"android";
    ApiLogin.loadAppToken(deviceType);

    return Scaffold(
      key: _scaffoldKey,
      // Appbar
      appBar: AppBar(
        //leading: Image.asset('images/logo_icon.png'),
        // Title
        title: Text("uLINK.no :: Shorten & Simplify URLs"),
        centerTitle: true,
        // Set the background color of the App Bar
        backgroundColor: Colors.deepOrangeAccent,
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.info),
            tooltip: 'About',
            onPressed: () {
              /*scaffoldKey.currentState.showSnackBar(SnackBar(
                  duration: Duration(seconds: 2),
                  content: Text('display info dialog'))); */
              _displayInfoDialog(context);
            },
          )
        ],
      ),
      body: CupertinoTabScaffold(
        tabBar: CupertinoTabBar(
          backgroundColor: Colors.transparent,
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              activeIcon: Icon(Icons.transform, size: 48.0, color: Colors.deepOrange),
              icon: Icon(Icons.transform, size: 33.0, color: Colors.deepOrangeAccent),
              //title: Text('Shorten')
            ),
            BottomNavigationBarItem(
              activeIcon: Icon(Icons.link, size: 48.0, color: Colors.deepOrange),
              icon: Icon(Icons.link, size: 33.0, color: Colors.deepOrangeAccent),
              //title: Text('Links'),
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
          }
          return tabView;
        },
      ),
    );
  }
}
