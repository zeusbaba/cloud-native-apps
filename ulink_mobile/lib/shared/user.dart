class User {
  String userid;
  String password;
  String createdAt;

  User({this.userid, this.password, this.createdAt});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userid: json['userid'] as String,
      password: json['password'] as String,
      createdAt: json['createdAt'] as String
    );
  }


}