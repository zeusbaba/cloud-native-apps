import 'package:flutter/material.dart';

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
