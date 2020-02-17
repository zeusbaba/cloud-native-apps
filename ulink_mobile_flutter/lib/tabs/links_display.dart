import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:ulink_mobile_flutter/shared/api_links.dart';
import 'package:ulink_mobile_flutter/shared/link.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';
import 'package:share/share.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class LinksDisplay extends StatefulWidget {
  @override
  LinksDisplayState createState() => LinksDisplayState();
}
class LinksDisplayState extends State<LinksDisplay> {

  // make use of pull_to_refresh module!
  List<MyLink> myLinks = new List();
  RefreshController _refreshController = RefreshController(initialRefresh: true);
  void _onRefresh() async{
    // monitor network fetch
    List<MyLink> loadLinks = await ApiLinks.getLinks();
    if (loadLinks.length == 0) {
      _refreshController.loadNoData();
    }

    if(mounted)
      setState(() {
        myLinks = new List();
        myLinks.addAll(loadLinks);
      });

    // if failed,use refreshFailed()
    _refreshController.refreshCompleted();
  }

  void _onLoading() async{
    // monitor network fetch
    List<MyLink> loadLinks = await ApiLinks.getLinks();
    // if failed,use loadFailed(),if no data return,use LoadNodata()

    if (loadLinks.length == 0) {
      _refreshController.loadNoData();
    }

    if(mounted)
      setState(() {
        myLinks = new List();
        myLinks.addAll(loadLinks);
      });
    _refreshController.loadComplete();
  }

  @override
  void initState() {
    super.initState();

  }
  @override
  void dispose() {
    // Dispose of the ...Controllers
    _refreshController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
        body: SmartRefresher(
          enablePullDown: true,
          enablePullUp: true,
          header: WaterDropHeader(),
          footer: CustomFooter(
            builder: (BuildContext context,LoadStatus mode){
              Widget body ;
              if(mode==LoadStatus.idle){
                body =  Text("pull up load");
              }
              else if(mode==LoadStatus.loading){
                body =  CupertinoActivityIndicator(); // CircularProgressIndicator();
              }
              else if(mode == LoadStatus.failed){
                body = Text("Load Failed! Click retry!");
              }
              else if(mode == LoadStatus.canLoading){
                body = Text("release to load more");
              }
              else{
                body = Text("No more Data");
              }
              return Container(
                height: 55.0,
                child: Center(child:body),
              );
            },
          ),
          controller: _refreshController,
          onRefresh: _onRefresh,
          onLoading: _onLoading,
          child: ListView.builder(
              itemCount: myLinks.length,
              itemBuilder: (BuildContext context, int index) {
                final myLink = myLinks[index];
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
                          CupertinoButton( //FlatButton(
                            child: const Text('COPY'),
                            onPressed: () {
                              FlutterClipboardManager.copyToClipBoard(short_link)
                                  .then((result) {
                                if(result){
                                  // Write to clipboard success
                                  //print('Copied to clipboard: ${short_link}');

                                  Scaffold
                                      .of(context)
                                      .showSnackBar(
                                        SnackBar(
                                          duration: Duration(seconds: 2),
                                            content: Text('Copied to clipboard! ${short_link}')
                                        )
                                      );

                                  //showDialog(
                                  //    context: context,
                                  //  builder: (context) => CupertinoAlertDialog(
                                  //    title: Text('Copied to clipboard!'),
                                  //    content: Text('${short_link}'),
                                  //  )
                                  // );
                                }
                              });
                            },
                          ),
                          CupertinoButton(
                            child: const Text('SHARE'),
                            onPressed: () {
                              String shareText = 'Shorten & Simplify via uLINK.no -> ${short_link}';
                              print('shareText: ${shareText}');
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
    );
  }
}
