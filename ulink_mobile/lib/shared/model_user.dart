class AppUser {
  String userid;
  String password;
  String createdAt;
  String appToken;

  AppUser({this.userid, this.password, this.createdAt, this.appToken});

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      userid: json['userid'] as String,
      password: json['password'] as String,
      createdAt: json['createdAt'] as String,
      appToken: json['appToken'] as String
    );
  }

  Map<String, dynamic> toJson() => {
    'userid': userid,
    'password': password,
    'createdAt': createdAt,
    'appToken': appToken
  };

}