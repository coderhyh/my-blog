module.exports = [
  [
    '@vuepress-reco/vuepress-plugin-kan-ban-niang', {
      theme: [
        'koharu', 'whiteCat', 'haru2', 'shizuku', 'wanko', 'z16'
      ],
      clean: true,
      messages: {
        welcome: '欢迎来到我的博客',
        home: '心里的花，我想要带你回家。',
        theme: '好吧，希望你能喜欢我的其他小伙伴。',
        close: '你不喜欢我了吗？痴痴地望着你。'
      },
      messageStyle: {
        right: '150px',
        bottom: '290px'
      },
      width: 150,
      height: 180
    }
  ],
  [
    "vuepress-plugin-cursor-effects",
    {
      size: 2, // size of the particle, default: 2
      shape: 'circle', // shape of the particle, default: 'star'
      zIndex: 999999999 // z-index property of the canvas, default: 999999999
    }
  ],
  ["sakura", {
    num: 20, // 默认数量
    show: true, //  是否显示
    zIndex: -1, // 层级
    img: {
      replace: false, // false 默认图 true 换图 需要填写httpUrl地址
      httpUrl: '...' // 绝对路径
    }
  }],
  [
    'meting',
    {
      meting: {
        auto: "https://music.163.com/#/discover/toplist?id=3778678"
      },
      aplayer: {
        autoplay: true,
        theme: "#00dada",
        lrcType: 3,
        order: 'random',
        volume: 0.1
      },
    },
  ],
  ["vuepress-plugin-nuggets-style-copy", {
    copyText: '复制',
    tip: {
      content: '复制成功!'
    }
  }],
  [
    'dynamic-title',
    {
      showIcon: '/favicon.ico',
      showText: '(๑*◡*๑)你好鸭~',
      hideIcon: '/favicon.ico',
      hideText: '(｀・ω・´)回来看看叭~',
      recoverTime: 2000,
    },
  ],
  ['img-lazy']
]