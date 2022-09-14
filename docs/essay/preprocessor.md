---
title: css and 预处理器
date: 2022-02-13
sidebar: 'auto'
tags:
 - css预处理器
 - css
categories:
 - css
 - 随笔
---

## css正则

```css
/* 匹配所有带href属性的标签 */
[href] {padding-left: 18px;}
/* 匹配href开头为https或//的标签 */
[href^="https"],
[href^="//"] {
  background: url("./images/link.png") no-repeat left;
}
/* 匹配href开头为#的标签 */
[href^="#"] {
  background: url("./images/anchor.png") no-repeat left;
}
/* 匹配手机和邮箱 */
[href^="tel:"] {
  background: url("./images/tel.png") no-repeat left;
}
[href^="mailto:"] {
  background: url("./images/e-mail.png") no-repeat left;
}
```

```css
/* 匹配href属性以.pdf结尾的标签 */
[href$=".pdf"] {
	background: url("./images/pdf.png") no repeat left;
}
/* 匹配href属性以.zip结尾的标签 */
[href$=".zip"] {
	background: url("./images/zip.png") no repeat left;
}
/* 图片链接 */
[href$=".png"],
[href$=".gif"],
[href$=".jpg"],
[href$=".jpeg"],
[href$=".webp"] {
	background: url("./images/image.png") no repeat left;
}
```

```
^ 表示从字符串开始位置匹配
$ 表示从字符串结束位置匹配
* 表示字符串任意位置匹配
i 表示字符串匹配不区分大小写 [attr*="val" I]
g 表示字符串全局匹配
```

::: tip

此外，搜索匹配的效果也可以通过根据输入内容动态创建一段CSS代码来实现。

:::

```html
<input type="search" id="input" placeholder="输入城市名称或拼音" />
<ul>
	<li data-search="上海市 shanghai">上海市</li>
	<li data-search="杭州市 hangzhou">杭州市</li>
</ul>
```

```js
var eleStyle = document.createElement('style');
document.head.appendChild(eleStyle);
// 文本输入框
input.addEventListener("input", function() {
	var value = this.value.trim();
	eleStyle.innerHTML = value
	? `[data-search]:not([data-search*="${value}"]) {display: none;}`
	: '';
});
```



## less

::: tip
安装

`npm i less@4 less-loader@8 -D`
:::

::: tip
使用

:::

```less
//变量
@pink: pink;
.box{
  color: @pink
}
//运算
.box {
  /* 伪类的写法 */
  &:hover {
    /*less中可以直接计算加减乘除计算的，编译之后会把计算的结果直接显示在css文件中。 */
    width: 200px / 3;
    width: 200px * 2;
    width: 200px + 100px;
    width: 200px - 100px;
  }
}
//函数
.common(@value) {
  width: @value;
  height: @value;
}
.red {
  /* 使用函数 */
  .common(100px);
  background-color: red;
}

//继承
.jicheng{
  width: auto;
  height: 50%;
  text-align: center;
  background: aqua;
}
.header:extend(.jicheng){
  /*header自身代码*/
  padding: 0 auto;
}


//继承所有状态（如伪类选择器）
.jicheng{
  width: auto;
  height: 50%;
  text-align: center;
  background: aqua;
}
.jicheng:hover{
  background: red;
}

/*没有加all*/
.header:extend(.jicheng){}
/*加入all*/
.footer:extend(.jicheng all){};

```

## sass

::: tip
更改sass镜像

`npm config set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/`

安装

`npm i node-sass sass-loader@10.0 -D`
:::



## 在vue中使用全局变量

### 前言：

正常在vue项目中的less文件中定义好了变量，然后在全局引入；**当使用的时候就会发现变量未定义**；所以针对这个问题可以使用这个`loader`

### 安装

::: tip

一共需要两个 `loader` 缺少会报错的

`npm install style-resources-loader vue-cli-plugin-style-resources-loader -D`

:::

### 使用

并在vue.config.js文件中配置，指定全局变量文件：

```js
const path = require('path')

module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径
        path.resolve(__dirname, "./src/assets/css/global.less"),
      ],
    },
  },
}
```
