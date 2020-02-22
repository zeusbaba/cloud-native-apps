import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';
import 'package:ulink_mobile/shared/api_links.dart';
import 'package:ulink_mobile/shared/common_utils.dart';
import 'package:ulink_mobile/views/link_display.dart';
import 'package:ulink_mobile/shared/model_link.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';
import 'package:share/share.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:jiffy/jiffy.dart';

class LinksDisplay extends StatefulWidget {
  @override
  LinksDisplayState createState() => LinksDisplayState();
}
class LinksDisplayState extends State<LinksDisplay> with WidgetsBindingObserver {

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
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _onRefresh();
    }
    super.didChangeAppLifecycleState(state);
  }

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addObserver(this);
  }
  @override
  void dispose() {
    // Dispose of the ...Controllers
    _refreshController.dispose();

    WidgetsBinding.instance.removeObserver(this);

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
                final short_link = CommonUtils.baseUrlLink(myLink.short_link);
                return Card(
                  //child: Text(myLink.toJson().toString())
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      ListTile(
                        //leading: Icon(Icons.link, size: 28, color: Colors.black12),
                        leading: Image.asset('images/logo_icon_s.png', scale: 4, ),
                        title: Text(
                            short_link,
                          style: TextStyle(fontSize: 22, color: Colors.deepOrange, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(' '),
                            Text(
                              myLink.long_link,
                              style: TextStyle(fontSize: 14, color: Colors.deepOrangeAccent, fontStyle: FontStyle.italic),
                              overflow: TextOverflow.fade,
                              softWrap: false,
                            ),
                            Text(
                              Jiffy(myLink.createdAt).fromNow(),
                              style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.deepOrangeAccent,
                                  fontStyle: FontStyle.italic,
                              ),
                            )
                          ],
                        ),
                        onTap: () {
                          //new DisplayLinkDialog(isNew: false, myLink: myLink);
                          showDialog(
                              context: context,
                              builder: (context) => new LinkDisplayDialog(isNew: false, myLink: myLink)
                          );
                        },
                        onLongPress: () {

                        },
                      ),
                      ButtonBar(
                        children: <Widget>[
                          CupertinoButton( //FlatButton(
                            child: Icon(Icons.content_copy, size: 33, color: Colors.deepOrange), //const Text('COPY'),
                            onPressed: () {
                              FlutterClipboardManager.copyToClipBoard(short_link)
                                  .then((result) {
                                if(result){
                                  // Write to clipboard success
                                  showDialog(
                                      context: context,
                                    builder: (context) => CupertinoAlertDialog(
                                      title: Text('Copied to clipboard!'),
                                      content: Text('${short_link}'),
                                    )
                                   );
                                }
                              });
                            },
                          ),
                          CupertinoButton(
                            child: Icon(Icons.share, size: 33, color: Colors.deepOrange), //const Text('SHARE'),
                            onPressed: () {
                              String shareText = 'Shorten & Simplify via uLINK.no -> ${short_link}';
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
    );
  }
}
