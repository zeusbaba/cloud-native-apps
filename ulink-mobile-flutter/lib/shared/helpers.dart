import 'package:shared_preferences/shared_preferences.dart';

class MyUtils {

  // If you call new MyUtils(), you'll always get the same instance.
  //You need to import the file that contains class MyUtils {} everywhere where you want to use it.
  //??= means new MyUtils._() is only executed when _instance is null and if it is executed the result will be assigned to _instance before it is returned to the caller.
  static MyUtils _instance;
  factory MyUtils() => _instance ??= new MyUtils._();
  MyUtils._();

  //static printing(String toPrint) {
  //  print(toPrint);
  //}

  static loadAppToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String appToken = "";
    String appTokenKey = "app-token";

    if (prefs.containsKey(appTokenKey)) {
      appToken = prefs.getString(appTokenKey);
    }
    else {
      // FIXME: implement login+auth via uLINK API!
      appToken = "uLINK-appToken";
      await prefs.setString(appTokenKey, appToken);
    }
    print('appToken: $appToken');

    return appToken;
  }
}
