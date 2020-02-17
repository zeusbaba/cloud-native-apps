import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:ulink_mobile_flutter/tabs/links_create.dart';
import 'package:ulink_mobile_flutter/tabs/links_display.dart';
import 'package:ulink_mobile_flutter/tabs/info_about.dart';
import 'package:ulink_mobile_flutter/shared/api_login.dart';

void main() {

  // This app is designed only to work vertically, so we limit
  // orientations to portrait up and down.
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]
  );

  runApp(MaterialApp(
      // Title
      title: "uLINK.no URL Shortener",
      // Home
      home: AppHome()));
}

class AppHome extends StatefulWidget {
  @override
  AppHomeState createState() => AppHomeState();
}

// SingleTickerProviderStateMixin is used for animation
class AppHomeState extends State<AppHome> with SingleTickerProviderStateMixin {
  // Create a tab controller
  TabController _tabController;

  @override
  void initState() {
    super.initState();

    // Initialize the Tab Controller
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    // Dispose of the Tab Controller
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var deviceType = (Theme.of(context).platform == TargetPlatform.iOS)?"ios":"android";
    ApiLogin.loadAppToken(deviceType);
    //dynamic appToken = MyUtils.loadAppToken(deviceType);
    //print('[build] appToken: $appToken');

    return Scaffold(
      // Appbar
      appBar: AppBar(
        leading: Image.asset('images/logo_icon.png'),
        // Title
        title: Text("uLINK.no :: shorten & simplify"),
        // Set the background color of the App Bar
        backgroundColor: Colors.orangeAccent,
      ),
      // Set the TabBar view as the body of the Scaffold
      body: TabBarView(
        // Add tabs as widgets
        children: <Widget>[LinksCreate(), LinksDisplay(), InfoAbout()],
        // set the controller
        controller: _tabController,
      ),
      // Set the bottom navigation bar
      bottomNavigationBar: Material(
        // set the color of the bottom navigation bar
        color: Colors.orangeAccent,
        // set the tab bar as the child of bottom navigation bar
        child: TabBar(
          tabs: <Tab>[
            Tab(
              // set icon to the tab
              icon: Icon(Icons.transform, size: 48.0),
            ),
            Tab(
              icon: Icon(Icons.link, size: 48.0),
            ),
            Tab(
              icon: Icon(Icons.info, size: 48.0),
            ),
          ],
          // setup the controller
          controller: _tabController,
        ),
      ),
    );
  }
}

/* // moved into shared MyUtils
_loadAppToken() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String appToken = "";
  String appTokenKey = "app-token";

  if (prefs.containsKey(appTokenKey)) {
    appToken = prefs.getString(appTokenKey);
  }
  else {
    appToken = "uLINK-appToken";
    await prefs.setString(appTokenKey, appToken);
  }
  MyUtils.print('appToken: $appToken');

  return appToken;
}*/
