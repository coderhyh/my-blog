const sidebar = require("./sidebar");
module.exports = {
  nav: [
    {
      text: "首页",
      link: "/",
      icon: "reco-home",
    },
    {
      text: "时间轴",
      link: "/timeline/",
      icon: "reco-date",
    },
    {
      text: "文档",
      icon: "reco-document",
      items: [
        {
          text: "随笔",
          link: "/docs/essay/material",
        },
        {
          text: "JavaScript",
          link: "/docs/javaScript/javascript-note",
        },
        {
          text: "TypeScript",
          link: "/docs/typeScript/learnts",
        },
        {
          text: "Vue",
          link: "/docs/vue/vue-concat",
        },
        {
          text: "Nodejs",
          link: "/docs/nodejs/nodejs-note",
        },
        {
          text: "Webpack",
          link: "/docs/webpack/webpack-note",
        },
        {
          text: "React",
          link: "/docs/react/react-note",
        },
        {
          text: "Electron",
          link: "/docs/electron/electron-index",
        },
        {
          text: "Linux",
          link: "/docs/linux/learn-linux.md",
        },
        {
          text: "Sql",
          link: "/docs/sql/learn-mysql.md",
        },
      ],
    },
    {
      text: "关于我",
      icon: "reco-message",
      items: [
        {
          text: "GitHub",
          link: "https://github.com/coderhyh",
          icon: "reco-github",
        },
        {
          text: "掘金",
          link: "https://juejin.cn/user/1605753976925661/posts",
          icon: "reco-juejin",
        },
      ],
    },
  ],
  sidebar,
  type: "blog",
  blogConfig: {
    category: {
      location: 2,
      text: "分类",
    },
    tag: {
      location: 3,
      text: "标签",
    },
  },
  friendLink: [
    // {
    //   "title": "vuepress-theme-reco",
    //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
    //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //   "link": "https://vuepress-theme-reco.recoluan.com"
    // }
  ],
  logo: "/logo.png",
  search: true,
  searchMaxSuggestions: 10,
  lastUpdated: "Last Updated",
  author: "coderhyh",
  authorAvatar: "/avatar.png",
  record: "豫ICP备2023018088号-1",
  recordLink: "https://beian.miit.gov.cn/#/Integrated/recordQuery",
  startYear: "2022",
};
