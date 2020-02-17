import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:ulink_mobile/shared/api_links.dart';

class LinksCreate extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        child: Center(
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

  @override
  Widget build(BuildContext context) {
    makeLinkForm = Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          TextFormField(
            decoration: const InputDecoration(
              hintText: 'Paste long link here',
            ),
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter some text';
              }
              bool _validURL = Uri.parse(value).isAbsolute;
              if (!_validURL) {
                return 'Please enter a proper URL';
              }
              setState(() {
                formInput['long_link'] = value.toString();
              });
              return null;
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: CupertinoButton(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.transform, size: 44.0),
                  Text('Shorten')
                ]
              ),
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (_formKey.currentState.validate()) {

                  print('$formInput');

                  Scaffold
                      .of(context)
                      .showSnackBar(
                        SnackBar(
                            duration: Duration(seconds: 2),
                            content: Text('Shortening your link')
                        )
                      );

                  ApiLinks.makeLink(formInput).then(
                      (myLink) => {
                        print('${myLink.toJson()}')

                      }
                  );

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
