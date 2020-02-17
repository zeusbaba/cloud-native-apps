import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:device_info/device_info.dart';
import 'package:ulink_mobile_flutter/shared/user.dart';
import 'package:ulink_mobile_flutter/shared/app_config.dart';

class ApiLogin {

  static final AppConfig appConfig = AppConfig.getAppConfig('prod');

  // If you call new MyUtils(), you'll always get the same instance.
  //You need to import the file that contains class MyUtils {} everywhere where you want to use it.
  //??= means new MyUtils._() is only executed when _instance is null and if it is executed the result will be assigned to _instance before it is returned to the caller.
  static ApiLogin _instance;
  factory ApiLogin() => _instance ??= new ApiLogin._();
  ApiLogin._();

  static final DeviceInfoPlugin deviceInfoPlugin = DeviceInfoPlugin();
  static Future<String> _getDeviceId(String deviceType) async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    if (deviceType.toLowerCase() == "ios") {
      IosDeviceInfo iosDeviceInfo = await deviceInfo.iosInfo;
      return iosDeviceInfo.identifierForVendor; // unique ID on iOS
    } else {
      AndroidDeviceInfo androidDeviceInfo = await deviceInfo.androidInfo;
      return androidDeviceInfo.androidId; // unique ID on Android
    }
  }

  static loadAppToken(String deviceType) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String appToken = "";

    // FIXME: remove this after validation!
    //prefs.clear();

    if (prefs.containsKey(appConfig.appTokenKey)) {
      //appToken = prefs.getString(appTokenKey);
      print('appToken EXISTs in local, move on..!');
    }
    else {
      // implement login+auth via uLINK API!
      var userId = await _getDeviceId(deviceType);
      userId = "uLINK-mobile-" + userId.toLowerCase();
      var user = User(userid: userId, password: userId, createdAt: '');
      print('appToken doesNOT exist in local, reloading via API! for userId: $userId');

      bool isUserOk = await _createUser(user);

      if (isUserOk) {

        appToken = await _createUserToken(user);
        if (appToken != '') {
          await prefs.setString(appConfig.appTokenKey, appToken);
        }
        else {
          print('ERROR occured when creating userToken! $appToken');
        }
      }
      else {
        print('ERROR occured when creating user! $user');
      }
    }
    //print('appToken: $appToken');

    return appToken;
  }

  static _createUser(User user) async {
    bool isUserOk = false;

    //var httpClient = http.Client();
    var apiResponse = await http.post(
        //apiUrl+"/users",
        appConfig.apiUrl+appConfig.apiEndpoint['users'],
        body: {
          'userid': user.userid,
          'password': user.password
        }
    );

    Map jsonResponse = json.decode(apiResponse.body);
    //print('jsonResponse: $jsonResponse');
    if (isResponseOk(apiResponse.statusCode)
      && jsonResponse.containsKey('userid')
      ) {
      isUserOk = true;
    }
    else if (apiResponse.statusCode == 500
      && jsonResponse.containsKey("message")
      ) {
      // check if user existed already

      // {
      //    "name": "GeneralError",
      //    "message": "E11000 duplicate key error collection: baet.baet_users index: _id_ dup key: { _id: \"flutter1\" }",
      //    "code": 500,
      //    "className": "general-error",
      //    "data": {
      //        "code": 11000
      //    },
      //    "errors": {}
      //}
      String errorMsg = jsonResponse['message'] as String;
      if (errorMsg.contains("index: _id_ dup key")) {
        isUserOk = true;
      }
    }
    
    return isUserOk;
  }

  static _createUserToken(User user) async {
    String userToken = '';

    //var apiUrl = "http://localhost:4042";
    //var httpClient = http.Client();
    var apiResponse = await http.post(
        //apiUrl+"/authentication",
        appConfig.apiUrl+appConfig.apiEndpoint['token'],
        body: {
          'strategy': 'local',
          'userid': user.userid,
          'password': user.password
        }
    );

    if (isResponseOk(apiResponse.statusCode)) {

      var jsonResponse = json.decode(apiResponse.body);
      //print('AUTH jsonResponse: $jsonResponse');

      if (jsonResponse.containsKey('accessToken')) {
        userToken = jsonResponse['accessToken'] as String;
        //print('AUTH appToken is OK: $appToken');
      }
    }

    return userToken;
  }

  static isResponseOk(int statusCode) {
    return (statusCode == 200 || statusCode == 201);
  }

}


