const plugins = require('./plugins');
const themeConfig = require('./themeConfig');

module.exports = {
  "title": "小黄杂货铺",
  "description": "coderhyh of blog",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  // serviceWorker: true, // 是否开启 PWA
  "theme": "reco",
  themeConfig,
  plugins,
  "markdown": {
    "lineNumbers": true
  },
  "search": true, //是否开启搜索
  "searchMaxSuggestions": 10, //最多的搜索建议条目
}