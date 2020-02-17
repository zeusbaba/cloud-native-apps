import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:ulink_mobile/shared/link.dart';
import 'package:ulink_mobile/shared/app_config.dart';

class ApiLinks {

  static final AppConfig appConfig = AppConfig.getAppConfig('prod');

  // If you call new MyUtils(), you'll always get the same instance.
  //You need to import the file that contains class MyUtils {} everywhere where you want to use it.
  //??= means new MyUtils._() is only executed when _instance is null and if it is executed the result will be assigned to _instance before it is returned to the caller.
  static ApiLinks _instance;
  factory ApiLinks() => _instance ??= new ApiLinks._();
  ApiLinks._();

  static Future<MyLink> makeLink(Map<String, dynamic> formInput) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    MyLink myLink;

    if (prefs.containsKey(appConfig.appTokenKey)) {
      String appToken = prefs.getString(appConfig.appTokenKey);

      myLink = await _makeLink(appToken, formInput);
    }
    else {
      myLink = new MyLink();
      print('ERROR!!! AppToken NOT found in local...');
      // TODO: implement a shared refreshToken mechanism
    }
    return myLink;
  }
  static _makeLink(String appToken, Map<String, dynamic> formInput) async {

    MyLink myLink = new MyLink();

    Map<String, dynamic> reqBody = new Map();
    reqBody['long_link'] = formInput['long_link'] as String;

    //var apiUrl = "http://localhost:4042";
    var apiResponse = await http.post(
        //apiUrl+"/links",
        appConfig.apiUrl+appConfig.apiEndpoint['links'],
        body: json.encode(reqBody),
        headers: {
          HttpHeaders.authorizationHeader: "Bearer $appToken",
          HttpHeaders.contentTypeHeader: "application/json",
          HttpHeaders.acceptHeader: "application/json"
        }
    );

    if (isResponseOk(apiResponse.statusCode)) {
      Map<String, dynamic> jsonResponse = json.decode(apiResponse.body);

      if (jsonResponse.containsKey("short_link")) {
        myLink = MyLink.fromJson(jsonResponse);
      }
    }

    return myLink;
  }

  static Future<List<MyLink>> getLinks() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<MyLink> links;

    if (prefs.containsKey(appConfig.appTokenKey)) {
      String appToken = prefs.getString(appConfig.appTokenKey);

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

    var apiResponse = await http.get(
        //apiUrl+"/links",
        appConfig.apiUrl+appConfig.apiEndpoint['links'],
        headers: {
          HttpHeaders.authorizationHeader: "Bearer $appToken",
          //HttpHeaders.contentTypeHeader: "application/json",
          HttpHeaders.acceptHeader: "application/json"
        }
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


