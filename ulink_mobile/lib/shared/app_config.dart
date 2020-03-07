
class AppConfig { // TODO externalise into env-specific config

  String baseUrl;
  String apiUrl;
  Map<String, String> apiUrls = {
    "dev": "http://localhost:4042",
    "prod": "https://api.ulink.no",
    "base": "https://ulink.no"
    };
  Map<String, String> apiEndpoint;
  Map<String, String> sharedPrefKeys = {
    "appUserKey": "app_user",
    "appTokenKey": "app_token",
    "copyClipboard": "copy_clipboard",
  };

  AppConfig({
    this.apiUrl, this.apiEndpoint, this.baseUrl,
  });

  static getAppConfig(String env) {
    return AppConfig(
      apiEndpoint: {
        "users": "/users",
        "token": "/authentication",
        "links": "/links"
      },
      apiUrl: (env.toLowerCase()=='prod'?'https://api.ulink.no':'http://localhost:4042'),
      baseUrl: (env.toLowerCase()=='prod'?'https://ulink.no':'http://localhost:4042'),
    );
  }
}