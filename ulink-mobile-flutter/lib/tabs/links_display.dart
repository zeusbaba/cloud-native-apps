import 'package:flutter/material.dart';

class LinksDisplay extends StatelessWidget {
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
              Icon(
                Icons.link,
                size: 160.0,
                color: Colors.orangeAccent,
              ),
              Text(
                "Links DISPLAY",
                style: TextStyle(color: Colors.orangeAccent),
              )
            ],
          ),
        ),
      ),
    );
  }
}
