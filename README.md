---
home: true
heroText: 随遇而安
tagline: A personalized personal blog.

bgImage: bgImg.jpg
bgImageStyle: {
  height: '95vh'
}
---

<script>
export default {
  data() {
    return {
      typewriter: '',
      i: 0,
      timer: 0,
      str: '//输入你要显示的的文本',
    }
  },
  mounted () {
    try {
      this.createSlide();
      const node = document.getElementsByClassName("footer-wrapper")[0].children[0];
      node.querySelector("i").className = "iconfont reco-gitlab";
      node.querySelector("a").innerHTML = "嘿嘿嘿";
      node.querySelector("a").href = "javascript:;";
      node.querySelector("a").target = "_self";
    } catch(err) {
      console.log(err)
    }
  },

  methods: {
    scrollFn() {
      const windowH = document.getElementsByClassName('hero')[0].clientHeight; // 获取窗口高度
      document.documentElement.scrollTop = windowH; // 滚动条滚动到指定位置
    },
    createSlide() {
      const ifJanchor = document.getElementById("JanchorDown"); 
      ifJanchor && ifJanchor.parentNode.removeChild(ifJanchor);
      let a = document.createElement('a');
      a.id = 'JanchorDown';
      a.className = 'anchor-down';
      document.getElementsByClassName('hero')[0].append(a);
      let targetA = document.getElementById("JanchorDown");
      targetA.addEventListener('click', e => { // 添加点击事件
        this.scrollFn();
      })
    }
  }
}
</script>

<style>
  /* .footer-wrapper span:nth-child(1) {
    display: none;
  } */
  blockquote {
    border-left-color: pink !important;
  }
 
  .anchor-down {
    display: block;
    margin: 12rem auto 0;
    bottom: 45px;
    width: 20px;
    height: 20px;
    font-size: 34px;
    text-align: center;
    animation: bounce-in 2s 1s infinite;
    position: absolute;
    left: 50%;
    bottom: 8%;
    margin-left: -10px;
    cursor: pointer;
  }
  @-webkit-keyframes bounce-in{
    0%{transform:translateY(0)}
    20%{transform:translateY(0)}
    50%{transform:translateY(-20px)}
    80%{transform:translateY(0)}
    to{transform:translateY(0)}
  }
  .anchor-down::before {
    content: "";
    width: 20px;
    height: 20px;
    display: block;
    border-right: 3px solid #fff;
    border-top: 3px solid #fff;
    transform: rotate(135deg);
    position: absolute;
    bottom: 10px;
  }
  .anchor-down::after {
    content: "";
    width: 20px;
    height: 20px;
    display: block;
    border-right: 3px solid #fff;
    border-top: 3px solid #fff;
    transform: rotate(135deg);
  }
  .hero>div {
    display: flex;
    flex-direction: column;
  }
  .hero h1, .hero p {
    width: 0;
    white-space: nowrap;
    font-family: monospace;
    border-right: 1px solid #00DADA;
    overflow : hidden;
    display: inline-block !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    color: #fff
  }
  .hero h1 {
    animation: title 2s steps(8) forwards, blink 1s infinite normal;
  }
  .hero p {
    animation: subtitle 2.5s steps(20) forwards, blink 1s infinite normal;
  }
  @keyframes title{
    0%{width: 0;}
    100%{width: 170px;}
  }
  @keyframes subtitle{
    0%{width: 0;}
    100%{width: 370px;}
  }
  @keyframes blink{
    50%{border-color: transparent;}
  }
</style>