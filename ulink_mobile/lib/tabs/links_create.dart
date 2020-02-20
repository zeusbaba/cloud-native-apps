import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:ulink_mobile/shared/api_links.dart';
import 'package:ulink_mobile/shared/common_utils.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';
import 'package:share/share.dart';

class LinksCreate extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      resizeToAvoidBottomPadding: false,
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      body: Container(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              // center the children
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Image.asset('images/logo_main.png'),
                LinkForm()
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LinkForm extends StatefulWidget {
  LinkForm({Key key}) : super(key: key);

  @override
  _LinkFormState createState() => _LinkFormState();
}

class _LinkFormState extends State<LinkForm> {
  final _formKey = GlobalKey<FormState>();
  Map<String, dynamic> formInput = new Map();
  Form makeLinkForm;
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    makeLinkForm = Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          TextFormField(
            textCapitalization: TextCapitalization.none,
            //autofocus: true,
            decoration: const InputDecoration(
              icon: Icon(Icons.http, size: 28.0),
              hintText: 'Paste a long link (URL)',
              hasFloatingPlaceholder: true,
              helperText: 'https://www.montypython.com/pythonland/'
            ),
            validator: (value) {

              Map<String, dynamic> _validURL = CommonUtils.isValidUrl(value);
              if (!_validURL['isValid']) {
                showDialog(
                    context: context,
                  builder: (context) => CupertinoAlertDialog(
                    title: Text('URL not valid!'),
                    content: Text('${_validURL['message'].toString()}'),
                  )
                 );
                return 'A valid URL is required!';
              }

              setState(() {
                formInput['long_link'] = value.toString();
              });
              return null;
            },
          ),

          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: isLoading?
              CupertinoActivityIndicator(radius: 44,)//CircularProgressIndicator()
                : CupertinoButton(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.transform, size: 66.0),
                  Text('Shorten')
                ]
              ),
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (_formKey.currentState.validate()) {

                  //print('$formInput');
                  setState(() {
                    isLoading = true;
                  });
                  Scaffold
                      .of(context)
                      .showSnackBar(
                        SnackBar(
                            duration: Duration(seconds: 2),
                            content: Text('Shortening your link')
                        )
                      );

                  ApiLinks.makeLink(formInput).then((myLink) => {
                        //print('${myLink.toJson()}')
                        showDialog(
                          context: context,
                          builder: (context) => CupertinoAlertDialog(
                            title: Text('uLink is ready!'),
                            content: Text('${CommonUtils.showLink(myLink.short_link)}'),
                            actions: <Widget>[
                              CupertinoButton( //FlatButton(
                                child: const Text('COPY'),
                                onPressed: () {
                                  FlutterClipboardManager.copyToClipBoard(CommonUtils.showLink(myLink.short_link))
                                      .then((result) {
                                    if(result){
                                      // Write to clipboard success

                                      showDialog(
                                          context: context,
                                          builder: (context) => CupertinoAlertDialog(
                                            title: Text('Copied to clipboard!'),
                                            content: Text('${CommonUtils.showLink(myLink.short_link)}'),
                                          )
                                      );
                                    }
                                  });
                                },
                              ),
                              CupertinoButton(
                                child: const Text('SHARE'),
                                onPressed: () {
                                  String shareText = 'Shorten & Simplify via uLINK.no -> ${CommonUtils.showLink(myLink.short_link)}';
                                  print('shareText: $shareText');
                                  Share.share(shareText);
                                },
                              ),
                            ],
                          )
                        )
                      }
                    ).whenComplete(() => {
                      setState(() { isLoading = false; })
                  });

                }
              },
            ),
          ),
        ],
      ),
    );

    return makeLinkForm;
  }
}
