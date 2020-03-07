import 'package:flutter/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:ulink_mobile/shared/utils_common.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';
import 'package:share/share.dart';
import 'package:ulink_mobile/shared/model_link.dart';

class LinkDisplayDialog extends StatelessWidget {

  bool isNew = false;
  MyLink myLink;
  LinkDisplayDialog({this.isNew, this.myLink});

  @override
  Widget build(BuildContext context) {

    return CupertinoAlertDialog(
      title: Text(
          isNew?'uLink is ready!':'uLink',
          style: TextStyle(fontSize: 20, color: Colors.deepOrange)
      ),
      //content: Text('${CommonUtils.baseUrlLink(myLink.short_link)}'),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(
              '${CommonUtils.baseUrlLink(myLink.short_link)}',
            style: TextStyle(fontSize: 18, color: Colors.deepOrange),
          ),
          Text(
            myLink.long_link,
            style: TextStyle(fontSize: 14, color: Colors.deepOrangeAccent, fontStyle: FontStyle.italic),
            overflow: TextOverflow.fade,
            softWrap: false,
          ),
        ],
      ),
      actions: <Widget>[
        CupertinoDialogAction(
          //textStyle: TextStyle(fontSize: 22, fontStyle: FontStyle.normal),
          child: Icon(Icons.content_copy, size: 44, color: Colors.deepOrange), //const Text('COPY'),
          onPressed: () {
            FlutterClipboardManager.copyToClipBoard(CommonUtils.baseUrlLink(myLink.short_link))
                .then((result) {
              if(result){
                // Write to clipboard success

                showDialog(
                    context: context,
                    builder: (context) => CupertinoAlertDialog(
                      title: Text('Copied to clipboard!'),
                      content: Text('${CommonUtils.baseUrlLink(myLink.short_link)}'),
                    )
                );
              }
            });

            Navigator.pop(context);
          },
        ),
        CupertinoDialogAction(
          //textStyle: TextStyle(fontSize: 22, fontStyle: FontStyle.normal),
          child: Icon(Icons.share, size: 44, color: Colors.deepOrange), //const Text('SHARE'),
          onPressed: () {
            String shareText = 'Shorten & Simplify via uLINK.no -> ${CommonUtils.baseUrlLink(myLink.short_link)}';
            print('shareText: $shareText');
            Share.share(shareText);

            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}