import 'package:flutter/material.dart';

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
            children: <Widget>[
              Image(image: AssetImage('images/logo_main.png')),
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

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          TextFormField(
            decoration: const InputDecoration(
              hintText: 'Paste long link here',
            ),
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter some text';
              }
              return null;
            },
          ),
          InputChip(
              avatar: CircleAvatar(
                backgroundColor: Colors.grey.shade800,
                child: Icon(Icons.link),
              ),
              label: Text('ETC ETC'),
              onPressed: () {
                print('chip pressed.');
              }
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: RaisedButton(
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (_formKey.currentState.validate()) {
                  // Process data.
                }
              },
              child: Text('Shorten'),
            ),
          ),
        ],
      ),
    );
  }
}
