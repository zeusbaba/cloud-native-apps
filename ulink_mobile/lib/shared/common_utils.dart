import 'package:device_info/device_info.dart';
import 'package:package_info/package_info.dart';
import 'package:ulink_mobile/shared/app_config.dart';
import 'package:url_launcher/url_launcher.dart';

class CommonUtils {

  static final AppConfig appConfig = AppConfig.getAppConfig('prod');

  static baseUrlLink(String short_link) {
    return appConfig.baseUrl + "/" + short_link;
  }

  static launchURL(url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  static final DeviceInfoPlugin deviceInfoPlugin = DeviceInfoPlugin();
  static Future<String> getDeviceId(String deviceType) async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    if (deviceType.toLowerCase() == "ios") {
      IosDeviceInfo iosDeviceInfo = await deviceInfo.iosInfo;
      return iosDeviceInfo.identifierForVendor; // unique ID on iOS
    } else {
      AndroidDeviceInfo androidDeviceInfo = await deviceInfo.androidInfo;
      return androidDeviceInfo.androidId; // unique ID on Android
    }
  }
  static Future<Map<String, dynamic>> getDeviceInfo(String deviceType) async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();

    Map<String, dynamic> infoMap = new Map();
    if (deviceType.toLowerCase() == "ios") {
      IosDeviceInfo iosDeviceInfo = await deviceInfo.iosInfo;
      infoMap['deviceId'] = iosDeviceInfo.identifierForVendor; // unique ID on iOS
      infoMap['isPhysicalDevice'] = iosDeviceInfo.isPhysicalDevice;
      infoMap['systemName'] = iosDeviceInfo.systemName;
      infoMap['systemVersion'] = iosDeviceInfo.systemVersion;
      infoMap['model'] = iosDeviceInfo.model;
    } else {
      AndroidDeviceInfo androidDeviceInfo = await deviceInfo.androidInfo;
      infoMap['deviceId'] = androidDeviceInfo.androidId; // unique ID on Android
      infoMap['isPhysicalDevice'] = androidDeviceInfo.isPhysicalDevice;
      infoMap['systemName'] = androidDeviceInfo.device;
      infoMap['systemVersion'] = androidDeviceInfo.version;
      infoMap['model'] = androidDeviceInfo.model;
    }

    return infoMap;
  }

  static Future<Map<String, String>> getPackageInfo() async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();

    Map<String, String> infoMap = new Map();
    infoMap['appName'] = packageInfo.appName;
    infoMap['version'] = packageInfo.version;
    infoMap['packageName'] = packageInfo.packageName;
    infoMap['buildNumber'] = packageInfo.buildNumber;

    return infoMap;
  }

  static isValidUrl(String urlInput) {

    Map<String, dynamic> response = new Map();

    if (urlInput.isEmpty) {
      response['isValid'] = false;
      response['message'] = 'Please enter some URL';
    }
    else if (urlInput.length<10 || urlInput.length>2000) {
      response['isValid'] = false;
      response['message'] = 'Invalid length ${urlInput.length}. URL can be min 10 chars and max 2000 chars long...';
    }
    else {
      // TODO: revisit this regex
      var urlPattern = r"(https?|http)://([-A-Z0-9.]+)(/[-A-Z0-9+&@#/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#/%=~_|!:‌​,.;]*)?";
      bool isValidUrl = new RegExp(urlPattern, caseSensitive: false)
          .hasMatch(urlInput);
      // bool isValidUrl = Uri.parse(value).isAbsolute;

      if (!isValidUrl) {
        response['isValid'] = false;
        response['message'] = 'Please enter a proper URL. E.g. https://www.montypython.com';
      }
      else {
        response['isValid'] = true;
      }
    }

    return response;
  }
}