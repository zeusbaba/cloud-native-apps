import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:ulink_mobile/shared/model_link.dart';
import 'package:ulink_mobile/shared/model_user.dart';
import 'package:ulink_mobile/shared/utils_common.dart';
import 'package:ulink_mobile/shared/utils_sharedpref.dart';

class ApiLinks {

  static ApiLinks _instance;
  factory ApiLinks() => _instance ??= new ApiLinks._();
  ApiLinks._();

  static Future<MyLink> makeLink(Map<String, dynamic> formInput) async {
    //SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    SharedPref sharedPref = new SharedPref();
    await sharedPref.initSharedPreferences();

    MyLink myLink;

    if (sharedPref.contains(CommonUtils.appConfig.sharedPrefKeys['appUserKey'])) {
      AppUser appUser = AppUser.fromJson(sharedPref.read(CommonUtils.appConfig.sharedPrefKeys['appUserKey']));

      try {
        myLink = await _makeLink(appUser.appToken, formInput);
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
    //SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    SharedPref sharedPref = new SharedPref();
    await sharedPref.initSharedPreferences();

    List<MyLink> links;

    if (sharedPref.contains(CommonUtils.appConfig.sharedPrefKeys['appUserKey'])) {
      AppUser appUser = AppUser.fromJson(sharedPref.read(CommonUtils.appConfig.sharedPrefKeys['appUserKey']));

      links = await _getLinks(appUser.appToken);
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


