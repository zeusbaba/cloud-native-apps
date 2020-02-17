import 'package:device_info/device_info.dart';
import 'package:package_info/package_info.dart';
import 'package:ulink_mobile/shared/app_config.dart';

class CommonUtils {

  static final AppConfig appConfig = AppConfig.getAppConfig('prod');

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

    var urlPattern = r"(https?|http)://([-A-Z0-9.]+)(/[-A-Z0-9+&@#/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#/%=~_|!:‌​,.;]*)?";
    return new RegExp(urlPattern, caseSensitive: false)
        .hasMatch(urlInput);
    // return Uri.parse(value).isAbsolute;
  }
}