import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:ulink_mobile/shared/model_user.dart';
import 'package:ulink_mobile/shared/utils_common.dart';
import 'package:ulink_mobile/shared/utils_sharedpref.dart';

class ApiLogin {

  // If you call new MyUtils(), you'll always get the same instance.
  //You need to import the file that contains class MyUtils {} everywhere where you want to use it.
  //??= means new MyUtils._() is only executed when _instance is null and if it is executed the result will be assigned to _instance before it is returned to the caller.
  static ApiLogin _instance;
  factory ApiLogin() => _instance ??= new ApiLogin._();
  ApiLogin._();

  static loadAppToken(String deviceType) async {
    //SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    SharedPref sharedPref = new SharedPref();
    await sharedPref.initSharedPreferences();

    String appToken = "";

    // NB! remove this after validation!
    //sharedPref.clear();

    if (sharedPref.contains(CommonUtils.appConfig.sharedPrefKeys['appUserKey'])) {
      print('appToken EXISTs in local, move on..!');
    }
    else {
      // implement login+auth via uLINK API!
      var userId = await CommonUtils.getDeviceId(deviceType);
      userId = "uLINK-mobile-" + userId.toLowerCase();
      var appUser = AppUser(userid: userId, password: userId, createdAt: '', appToken: '');
      print('appToken doesNOT exist in local, reloading via API! for userId: $userId');

      bool isUserOk = await _createUser(deviceType, appUser);

      if (isUserOk) {

        appToken = await _createUserToken(appUser);
        if (appToken != '') {
          appUser.appToken = appToken;
          sharedPref.save(CommonUtils.appConfig.sharedPrefKeys['appUserKey'], appUser);
        }
        else {

          print('ERROR occured when creating userToken! $appToken');
          throw Future.error('ERROR occured when creating userToken!');
        }
      }
      else {
        print('ERROR occured when creating user! $appUser');
        throw Future.error('ERROR occured when creating user!');
      }
    }
    //print('appToken: $appToken');

    return appToken;
  }

  static _createUser(String deviceType, AppUser user) async {
    bool isUserOk = false;

    Map<String, dynamic> deviceInfoMap = await CommonUtils.getDeviceInfo(deviceType);
    //String deviceInfo = json.encode(deviceInfoMap);
    Map<String, String> packageInfoMap = await CommonUtils.getPackageInfo();
    //String appInfo = json.encode(packageInfoMap);
    //print('appInfo: $appInfo');

    Map<String, dynamic> reqBody = new Map();
    reqBody['userid'] = user.userid;
    reqBody['password'] = user.password;
    reqBody['extra'] = {
      'appInfo': packageInfoMap, //appInfo,
      'deviceInfo': deviceInfoMap //deviceInfo
    };

    //var httpClient = http.Client();
    var apiResponse = await http.post(
        CommonUtils.appConfig.apiUrl+CommonUtils.appConfig.apiEndpoint['users'],
        body: json.encode(reqBody),
        headers: {
          HttpHeaders.contentTypeHeader: "application/json",
          HttpHeaders.acceptHeader: "application/json"
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

  static _createUserToken(AppUser user) async {
    String userToken = '';

    Map<String, dynamic> reqBody = new Map();
    reqBody['userid'] = user.userid;
    reqBody['password'] = user.password;
    reqBody['strategy'] = 'local';

    //var httpClient = http.Client();
    var apiResponse = await http.post(
        CommonUtils.appConfig.apiUrl+CommonUtils.appConfig.apiEndpoint['token'],
        body: json.encode(reqBody),
        headers: {
          HttpHeaders.contentTypeHeader: "application/json",
          HttpHeaders.acceptHeader: "application/json"
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


