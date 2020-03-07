import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class SharedPref {

  SharedPreferences _prefs;
  /*SharedPref(SharedPreferences prefs) {
    this._prefs = prefs;
  }
  static initSharedPreferences() async {
    //this._prefs = await SharedPreferences.getInstance();
    //return _prefs;
    return await SharedPreferences.getInstance();
  }
  */
  /*SharedPref() {
    initSharedPreferences();
  }*/
  initSharedPreferences() async {
    this._prefs = await SharedPreferences.getInstance();
  }

  read(String key) {// async {
    //final prefs = await initSharedPreferences();
    return contains(key)? json.decode(_prefs.getString(key)) : null;
  }

  save(String key, value) {// async {
    //final prefs = await initSharedPreferences();
    _prefs.setString(key, json.encode(value));
  }

  contains(String key) {// async {
    //final prefs = await initSharedPreferences();
    return _prefs.containsKey(key);
  }

  remove(String key) {// async {
    //final prefs = await initSharedPreferences();
    _prefs.remove(key);
  }

  clear() {// async { // clear all keys from prefs
    //final prefs = await initSharedPreferences();
    _prefs.clear();
  }
}