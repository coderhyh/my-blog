---
title: 性能优化
date: 2022-04-18
sidebar: 'auto'
tags:
 - 资料
 - learn
categories:
 -  随笔
---
::: tip
![img](/images/14.png)
:::
<!-- more -->

## 图片压缩

一般本地图片太大，访问时就会造成请求速度变慢；所以就可以使用插件来压缩图片

### 安装

`npm i image-webpack-loader -D`

::: warning

注意！！！

由于npm是国外的  所以会有丢包的问题  造成打包的时候报错 （修改淘宝的镜像源好像也不可以）

可以使用cnpm下载就可以解决 

`npm i cnpm -g`

:::

### 使用

在 `vue.config.js` 配置好即可奔放了~

::: warning

注：我这个配置是 `CLI 5.x` 的写法

:::

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
  },
})
```

