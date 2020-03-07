import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/scheduler.dart';
import 'package:ulink_mobile/shared/api_links.dart';
import 'package:ulink_mobile/shared/utils_common.dart';
import 'package:ulink_mobile/shared/model_clipboard.dart';
import 'package:ulink_mobile/shared/utils_sharedpref.dart';
import 'package:ulink_mobile/views/link_display.dart';
import 'package:flutter_chips_input/flutter_chips_input.dart';
import 'package:flutter_clipboard_manager/flutter_clipboard_manager.dart';

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

class _LinkFormState extends State<LinkForm> with WidgetsBindingObserver {
  final _formKey = GlobalKey<FormState>();
  Map<String, dynamic> formInput = new Map();
  bool isLoading = false;
  String initialValue = '';
  TextEditingController _textEditingController = TextEditingController(text: '');

  SharedPref sharedPref;

  useFromClipboard() async {

    //FlutterClipboardManager.copyFromClipBoard().then((linkToCopy) {
    String linkToCopy = await FlutterClipboardManager.copyFromClipBoard();

    if (CommonUtils.isValidUrl(linkToCopy)['isValid']
      && !(linkToCopy.contains("ulink.no"))
      && !(linkToCopy.contains("baet.no"))
    ) {

      CopyClipboard copyClipboard = new CopyClipboard(
          linkToCopy: linkToCopy, isDisplayed: true, isPasted: false
      );
      if (!copyClipboard.existInSharedPrefs(sharedPref)) {
        showDialog(
            context: context,
            builder: (context) =>
                CupertinoAlertDialog(
                  title: Text('Paste this URL?'),
                  content: Text('$linkToCopy',
                    overflow: TextOverflow.fade,
                    softWrap: false,
                  ),
                  actions: <Widget>[
                    CupertinoDialogAction(
                      textStyle: TextStyle(
                          fontSize: 22, fontStyle: FontStyle.normal),
                      child: Icon(Icons.content_paste, size: 28,
                          color: Colors.deepOrange), //const Text('Yes'),
                      onPressed: () {
                        _textEditingController.clear();
                        _textEditingController.text = linkToCopy;

                        copyClipboard.isPasted = true;
                        copyClipboard.saveInSharedPrefs(sharedPref);

                        Navigator.pop(context);
                      },
                    ),
                    CupertinoDialogAction(
                      isDefaultAction: true,
                      textStyle: TextStyle(
                          fontSize: 18, fontStyle: FontStyle.normal),
                      child: Icon(
                          Icons.cancel, size: 28, color: Colors.deepOrange),
                      //const Text('No'),
                      onPressed: () {

                        copyClipboard.isPasted = false;
                        copyClipboard.saveInSharedPrefs(sharedPref);

                        //_textEditingController.text = '';
                        Navigator.pop(context);
                      },
                    ),
                  ],
                )
        );
      }
    }
    //});
  }

  @override
  void initState() {
    super.initState();

    //sharedPref = new SharedPref(SharedPref.initSharedPreferences());
    sharedPref = new SharedPref();
    sharedPref.initSharedPreferences();

    //if (SchedulerBinding.instance.schedulerPhase == SchedulerPhase.persistentCallbacks) {

      // listen to when first loaded
      WidgetsBinding.instance.addPostFrameCallback((_) => useFromClipboard() );
    //}

    // listen to appstates
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      useFromClipboard();
    }
    super.didChangeAppLifecycleState(state);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          TextFormField(
            textCapitalization: TextCapitalization.none,
            //autofocus: true,
            //initialValue: initialValue,
            controller: _textEditingController,
            cursorColor: Colors.deepOrange,
            style: TextStyle(color: Colors.deepOrangeAccent),
            decoration: const InputDecoration(
                icon: Icon(Icons.http, size: 24.0, color: Colors.deepOrangeAccent),
                hintText: 'Paste a long link (URL)',
                hintStyle: TextStyle(color: Colors.deepOrangeAccent, fontStyle: FontStyle.normal),
                //hasFloatingPlaceholder: true,
                helperText: 'https://www.montypython.com/pythonland/',
              helperStyle: TextStyle(color: Colors.orangeAccent, fontStyle: FontStyle.italic),
              errorStyle: TextStyle(color: Colors.deepOrange, fontStyle: FontStyle.italic),
            ),
            validator: (inputValue) {
              Map<String, dynamic> _validURL =
                  CommonUtils.isValidUrl(inputValue);
              if (!_validURL['isValid']) {
                showDialog(
                    context: context,
                    builder: (context) => CupertinoAlertDialog(
                          title: Text('URL not valid!'),
                          content: Text('${_validURL['message'].toString()}'),
                        ));
                return 'A valid URL is required!';
              }

              setState(() {
                formInput['long_link'] = inputValue.toString();
              });
              return null;
            },
          ),
          /*TODO: ChipsInput(
            initialValue: [],
            keyboardAppearance: Brightness.dark,
            textCapitalization: TextCapitalization.words,
            enabled: true,
            maxChips: 3,
            textStyle:
            TextStyle(height: 1.5, fontFamily: "Roboto", fontSize: 16),
            decoration: InputDecoration(
              // prefixIcon: Icon(Icons.link),
              // hintText: formControl.hint,
              labelText: "Simple Links",
              // enabled: false,
              // errorText: field.errorText,
            ),
            onChanged: (data) {
              print(data);
            },
            chipBuilder: (context, state, profile) {
              return InputChip(
                key: ObjectKey(profile),
                label: Text(profile.name),
                avatar: CircleAvatar(
                  backgroundImage: NetworkImage(profile.imageUrl),
                ),
                onDeleted: () => state.deleteChip(profile),
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              );
            },
          ),*/
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: isLoading
                ? CupertinoActivityIndicator(
                    radius: 44,
                  ) //CircularProgressIndicator()
                : CupertinoButton(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(Icons.transform, size: 66.0, color: Colors.deepOrange),
                          //Image.asset('images/logo_icon_s.png', scale: 2),
                          Text('Shorten',
                            style: TextStyle(
                                fontSize: 22,
                                fontStyle: FontStyle.normal,
                                color: Colors.deepOrange
                            ),
                          )
                        ]),
                    onPressed: () {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (_formKey.currentState.validate()) {
                        //print('$formInput');
                        setState(() {
                          isLoading = true;
                        });
                        Scaffold.of(context).showSnackBar(SnackBar(
                            duration: Duration(seconds: 2),
                            content: Text('Shortening your link...')));

                        ApiLinks.makeLink(formInput)
                            .then((myLink) {
                                  //print('${myLink.toJson()}')
                              _formKey.currentState.reset();
                              showDialog(
                                  context: context,
                                  builder: (context) => new LinkDisplayDialog(isNew: true, myLink: myLink)
                              );
                            })
                            .catchError((error) {
                              print(error);
                              String errorContent = '';
                              if (error['message']) {
                                errorContent = error['message'];
                              } else {
                                errorContent = 'Some unknown error occured...';
                              }
                              showDialog(
                                  context: context,
                                  builder: (context) => CupertinoAlertDialog(
                                        title: Text('Error occured!'),
                                        content: Text(errorContent),
                                      ));
                            }).whenComplete(() => {
                                  setState(() {
                                    isLoading = false;
                                  })
                                });
                      }
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
