import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:ulink_mobile_flutter/shared/link.dart';

class ApiLinks {

  // If you call new MyUtils(), you'll always get the same instance.
  //You need to import the file that contains class MyUtils {} everywhere where you want to use it.
  //??= means new MyUtils._() is only executed when _instance is null and if it is executed the result will be assigned to _instance before it is returned to the caller.
  static ApiLinks _instance;
  factory ApiLinks() => _instance ??= new ApiLinks._();
  ApiLinks._();


  static Future<List<MyLink>> getLinks() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    //String appToken = "";
    String appTokenKey = "app-token";
    List<MyLink> links;

    if (prefs.containsKey(appTokenKey)) {
      String appToken = prefs.getString(appTokenKey);

      links = await _getLinks(appToken);
    }
    else {
      links = new List<MyLink>();
      print('ERROR!!! AppToken NOT found in local...');
      // TODO: implement a shared refreshToken mechanism
    }
    //print('appToken: $appToken');

    return links;
  }

  static _getLinks(String appToken) async {

    List<MyLink> links = new List();

    var apiUrl = "http://localhost:4042";
    var apiResponse = await http.get(
        apiUrl+"/links",
        headers: {HttpHeaders.authorizationHeader: "Bearer $appToken"}
    );

    if (isResponseOk(apiResponse.statusCode)) {
      Map<String, dynamic> jsonResponse = json.decode(apiResponse.body);

      if (jsonResponse.containsKey("data")) {
          List dataItems = jsonResponse['data'] as List;
          dataItems.forEach((dataItem) {
            links.add( MyLink.fromJson(dataItem) );
          });
      }
    }

    return links;
  }

  static isResponseOk(int statusCode) {
    return (statusCode == 200 || statusCode == 201);
  }

}


