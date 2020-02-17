import 'package:flutter/material.dart';
import 'package:ulink_mobile/shared/api_links.dart';
import 'package:ulink_mobile/shared/link.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';
import 'package:share/share.dart';

class LinksDisplay extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<MyLink>>(
      future: ApiLinks.getLinks(),
        builder: (context, AsyncSnapshot<List<MyLink>> snapshot) {
          if (snapshot.hasData) {
            return Scaffold(
              backgroundColor: Colors.white,
              body: Container(
                child: Center(
                  child: ListView.builder(
                    itemCount: snapshot.data.length,
                      itemBuilder: (BuildContext context, int index) {
                        final myLink = snapshot.data[index];
                        final short_link = 'https://ulink.no/'+myLink.short_link;
                        return Card(
                          //child: Text(myLink.toJson().toString())
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              ListTile(
                                leading: Icon(Icons.link),
                                title: Text(short_link),
                                subtitle: Text(
                                    myLink.long_link,
                                  overflow: TextOverflow.fade,
                                  softWrap: false,
                                ),
                              ),
                              ButtonBar(
                                children: <Widget>[
                                  FlatButton(
                                    child: const Text('COPY'),
                                    onPressed: () {
                                      FlutterClipboardManager.copyToClipBoard(short_link)
                                          .then((result) {
                                        if(result){
                                          // Write to clipboard success
                                          print('Copied to clipboard: $short_link');
                                        }
                                      });
                                    },
                                  ),
                                  FlatButton(
                                    child: const Text('SHARE'),
                                    onPressed: () {
                                      String shareText = 'Shorten & Simplify via uLINK.no -> $short_link';
                                      print('shareText: $shareText');
                                      Share.share(shareText);
                                    },
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }
                  ),
                ),
              ),
            );
          } else {
            return CircularProgressIndicator();
          }
        }
    );
  }
}
