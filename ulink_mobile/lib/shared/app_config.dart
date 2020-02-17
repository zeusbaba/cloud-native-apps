
class AppConfig { // TODO externalise into env-specific config

  String apiUrl;
  Map<String, String> apiUrls = {
    "dev": "http://localhost:4042",
    "prod": "https://api.ulink.no"
    };
  Map<String, String> apiEndpoint;
  String appTokenKey = "app_token";

  AppConfig({
    this.apiUrl, this.apiEndpoint,  this.appTokenKey
  });

  static getAppConfig(String env) {
    return AppConfig(
      appTokenKey: "app_token",
      apiEndpoint: {
        "users": "/users",
        "token": "/authentication",
        "links": "/links"
      },
      apiUrl: (env.toLowerCase()=='prod'?'https://api.ulink.no':'http://localhost:4042'),
    );
  }
}