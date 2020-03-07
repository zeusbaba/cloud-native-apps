// keep track of copied links
// to avoid asking the user multiple times about the same link
import 'package:ulink_mobile/shared/utils_common.dart';
import 'package:ulink_mobile/shared/utils_sharedpref.dart';

class CopyClipboard {

  String linkToCopy;
  bool isPasted;
  bool isDisplayed;

  CopyClipboard({this.linkToCopy, this.isDisplayed, this.isPasted});

  CopyClipboard.fromJson(Map<String, dynamic> json)
    : linkToCopy = json['linkToCopy'],
      isPasted = json['isPasted'],
      isDisplayed = json['isDisplayed'];

  Map<String, dynamic> toJson() => {
    'linkToCopy': linkToCopy,
    'isPasted': isPasted,
    'isDisplayed': isDisplayed
  };

  // list utils
  existInSharedPrefs(SharedPref sharedPref) {
    bool isExists = false;

    String prefKey = CommonUtils.appConfig.sharedPrefKeys['copyClipboard'];
    if (!sharedPref.contains(prefKey)) {
      return isExists;
    }
    Iterable it = sharedPref.read(prefKey);
    List<CopyClipboard> copyItems = it.map((item) => CopyClipboard.fromJson(item)).toList();

    for (CopyClipboard copyItem in copyItems) {
      if (copyItem.linkToCopy == this.linkToCopy) {
        isExists = true;
        break;
      }
    }

    return isExists;
  }
  saveInSharedPrefs(SharedPref sharedPref) {
    CopyClipboard copyClipboard = this;

    //SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    String prefKey = CommonUtils.appConfig.sharedPrefKeys['copyClipboard'];
    Iterable it = sharedPref.read(prefKey);
    List<CopyClipboard> copyItems = new List();
    if (it != null) {
      copyItems = it.map((item) => CopyClipboard.fromJson(item)).toList();
    }
    copyItems.add(copyClipboard);

    sharedPref.remove(prefKey);
    sharedPref.save(prefKey, copyItems);

  }


  /*
  static existInSharedPrefs(CopyClipboard copyClipboard) async {
    bool isExists = false;

    SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    String prefKey = CommonUtils.appConfig.sharedPrefKeys['copyClipboard'];
    if (!sharedPref.contains(prefKey)) {
      return isExists;
    }
    Iterable it = sharedPref.read(prefKey);
    List<CopyClipboard> copyItems = it.map((item) => CopyClipboard.fromJson(item)).toList();

    for (CopyClipboard copyItem in copyItems) {
      if (copyItem.linkToCopy == copyClipboard.linkToCopy) {
        isExists = true;
        break;
      }
    }

    return isExists;
  }
  static saveInSharedPrefs(CopyClipboard copyClipboard) async {
    SharedPref sharedPref = new SharedPref(await SharedPref.initSharedPreferences());
    String prefKey = CommonUtils.appConfig.sharedPrefKeys['copyClipboard'];
    Iterable it = sharedPref.read(prefKey);
    List<CopyClipboard> copyItems = it.map((item) => CopyClipboard.fromJson(item)).toList();

    copyItems.add(copyClipboard);

    sharedPref.remove(prefKey);
    sharedPref.save(prefKey, copyItems);
  }
  */
}