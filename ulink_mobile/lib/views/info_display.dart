import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:ulink_mobile/shared/utils_common.dart';

class InfoDisplayDialog extends StatelessWidget {

  //String whichPage;
  //InfoDisplayDialog({this.whichPage});

  @override
  Widget build(BuildContext context) {
    return CupertinoAlertDialog(
      title: Text(
          'About uLINK',
        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.deepOrange),
      ),
      content: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(''),
          Text(
            'uLINK is an easy to use (and free!) service to Shorten & Simplify URLs!',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          Text('Give it a URL, and it shortens it into an alphanumeric word of 6-7 chars. '),
          Text(''),
          Text('For more details, go to uLINK.no'),
        ],
      ),
      actions: <Widget>[
        CupertinoDialogAction(
          child: Icon(Icons.open_in_browser, size: 44, color: Colors.deepOrange),
          onPressed: () {

            CommonUtils.launchURL("https://www.ulink.no/about");

            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}
