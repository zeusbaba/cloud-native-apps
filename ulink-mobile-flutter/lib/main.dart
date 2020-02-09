import 'package:flutter/material.dart';
import 'package:ulink_mobile_flutter/tabs/links_create.dart';
import 'package:ulink_mobile_flutter/tabs/links_display.dart';
import 'package:ulink_mobile_flutter/tabs/info_about.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ulink_mobile_flutter/shared/helpers.dart';

void main() {

  runApp(MaterialApp(
      // Title
      title: "uLINK.no URL Shortener",
      // Home
      home: MyHome()));
}

class MyHome extends StatefulWidget {
  @override
  MyHomeState createState() => MyHomeState();
}

// SingleTickerProviderStateMixin is used for animation
class MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin {
  // Create a tab controller
  TabController controller;

  @override
  void initState() {
    super.initState();

    // Initialize the Tab Controller
    controller = TabController(length: 3, vsync: this);

    dynamic appToken = MyUtils.loadAppToken();
    print('[initState] appToken: $appToken');
  }

  @override
  void dispose() {
    // Dispose of the Tab Controller
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
        controller: controller,
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
          controller: controller,
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
