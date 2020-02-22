import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:ulink_mobile/shared/model_link.dart';
import 'package:ulink_mobile/shared/common_utils.dart';

class ApiLinks {

  static ApiLinks _instance;
  factory ApiLinks() => _instance ??= new ApiLinks._();
  ApiLinks._();

  static Future<MyLink> makeLink(Map<String, dynamic> formInput) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    MyLink myLink;

    if (prefs.containsKey(CommonUtils.appConfig.appTokenKey)) {
      String appToken = prefs.getString(CommonUtils.appConfig.appTokenKey);

      try {
        myLink = await _makeLink(appToken, formInput);
      }
      catch(ex) {
        throw Future.error(ex);
      }
    }
    else {
      myLink = new MyLink();
      print('ERROR!!! AppToken NOT found in local...');
      // TODO: implement a shared refreshToken mechanism

      throw Future.error('ERROR!!! AppToken NOT found in local...');
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
        CommonUtils.appConfig.apiUrl+CommonUtils.appConfig.apiEndpoint['links'],
        body: json.encode(reqBody),
        headers: {
          HttpHeaders.authorizationHeader: "Bearer $appToken",
          HttpHeaders.contentTypeHeader: "application/json",
          HttpHeaders.acceptHeader: "application/json"
        }
    ).catchError((error) {
      print(error);
      throw Future.error(error.toString());
    });

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

    if (prefs.containsKey(CommonUtils.appConfig.appTokenKey)) {
      String appToken = prefs.getString(CommonUtils.appConfig.appTokenKey);

      links = await _getLinks(appToken);
    }
    else {
      links = new List<MyLink>();
      print('ERROR!!! AppToken NOT found in local...');
      // TODO: implement a shared refreshToken mechanism

      throw Future.error('ERROR!!! AppToken NOT found in local...');
    }
    //print('appToken: $appToken');

    return links;
  }

  static _getLinks(String appToken) async {

    List<MyLink> links = new List();

    var apiResponse = await http.get(
        //apiUrl+"/links",
        CommonUtils.appConfig.apiUrl+CommonUtils.appConfig.apiEndpoint['links'],
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


