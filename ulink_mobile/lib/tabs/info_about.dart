import 'package:flutter/material.dart';
//import 'package:webview_flutter/webview_flutter.dart';

class InfoAbout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        child: Center(
          child: Column(
            // center the children
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              // TODO: we might use WebView to display AboutPage from remote
              // WebView(
              //                initialUrl: 'https://www.ulink.no/about',
              //                javascriptMode: JavascriptMode.unrestricted,
              //                onPageStarted: (String url) {
              //                  print('Page started loading: $url');
              //                },
              //                onPageFinished: (String url) {
              //                  print('Page finished loading: $url');
              //                },
              //                gestureNavigationEnabled: true,
              //              )
              Icon(
               Icons.info,
                size: 160.0,
                color: Colors.orange,
              ),
              Text(
                "Info About",
                style: TextStyle(color: Colors.orange),
              )
            ],
          ),
        ),
      ),
    );
  }
}
