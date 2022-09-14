---
title: 字体压缩
date: 2022-04-18
sidebar: 'auto'
tags:
 - 资料
 - learn
categories:
 -  随笔
---
::: tip
![img](/images/13.jpg)
:::
<!-- more -->



## 前言：

### font-spider

通过分析本地 CSS 与 HTML 文件获取 WebFont 中没有使用的字符，并将这些字符数据从字体中删除以实现压缩，同时生成跨浏览器使用的格式。中文 WebFont 自动化压缩工具。官方网站 [font-spider](http://font-spider.org/)

## 使用步骤

### 1、安装

::: tip

`npm install font-spider -g`

:::

### 2、使用

::: tip

结构

​	  -- 庞门正道标题体2.0增强版.ttf

​	  -- index.html

**首先在html中以这样的方式来导入**

::: 

::: warning 

建议在字体导入的时候 指定字体类型

:::

```html
<style>
  @font-face {
    font-family: '旁门正道';  /* 使用字体得名字 */
    src: url('./庞门正道标题体2.0增强版.ttf');
    src: url('./庞门正道标题体2.0增强版.eot?#font-spider') format('embedded-opentype'),
      url('./庞门正道标题体2.0增强版.woff') format('woff'),
      url('./庞门正道标题体2.0增强版.ttf') format('truetype'),
      url('./庞门正道标题体2.0增强版.svg') format('svg');
    font-weight: normal;
    font-style: normal;
  }
</style>

<div style="font-family: '旁门正道';">
  一键叫车1234567890sS
</div>

```

### 3、使用font-spider压缩字体

::: tip

`font-spider ./index.html`

查看安装版本

` font-spider -V`

:::

## 总结

::: warning

因为 font-spider 只能抽取静态得内容 ，不能动态抽取，对应一些页面上面写死得文字我们可以拿来抽取，达到字体文件包得减少，对应服务端返回数据不能使用font-spider抽离（可以字母汉字符号抽离，因为汉字太多无法抽离，对应汉字需要显示特殊字体还是需要引用原始字体包来实现）

:::