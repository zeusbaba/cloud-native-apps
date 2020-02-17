class MyLink {
  String short_link;
  String long_link;
  List<String> simple_links;
  String createdAt;

  MyLink({
    this.long_link,
    this.short_link,
    this.simple_links,
    this.createdAt
  });

  doMyLink(String longLink, String shortLink) {
    return MyLink(
      long_link: longLink,
      short_link: shortLink,
      simple_links: [],
      createdAt: ''
    );
  }

  factory MyLink.fromJson(Map<String, dynamic> json) {
    return MyLink(
        long_link: json.containsKey('long_link')?json['long_link'] as String:'',
        short_link: json.containsKey('short_link')?json['short_link'] as String:'',
        simple_links: [], // TODO json.containsKey('simple_links')?json['simple_links'] as List<String>:[],
        createdAt: json.containsKey('createdAt')?json['createdAt'] as String:''
    );
  }

  Map<String, dynamic> toJson() => {
    'long_link': long_link,
    'short_link': short_link,
    'simple_links': simple_links
  };

}