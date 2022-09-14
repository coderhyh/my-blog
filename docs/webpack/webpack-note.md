---
title: webpack笔记
date: 2022-2-10
sidebar: 'auto'
tags:
 - 笔记
 - webpack
categories:
 -  webpack
---


# webpack
::: tip
npm i webpack webpack-cli html-webpack-plugin webpack-dev-server -D
:::

::: tip
安装webpack
npm i webpack webpack-cli -D
:::

::: tip
新建 webpack.config.js 书写配置
:::

```js
module.exports={
  //打包入口
  entry:"",
  //输出
  output:{
    filename:"build.js"
  }
}
```

::: tip
运行 在package.json中自定义命令
:::

```js
"script":{
  "build":"webpack"
}
```

::: tip
使用模板(html)
npm i html-webpack-plugin -D
:::

```js
const htmlwebpackplugin=require("html-webpack-plugin");

plugins:[
  new htmlwebpackplugin({
    template:"./src/index.html"
  })
]
```

::: tip
预览服务 devServer 	
npm i webpack-dev-server -D 
:::

```js
devServer:{
  static:"./dist"
}

//在package.json新增自定义命令
"scripts":{
  "dev":"webpack serve --open"
}
```

::: tip
文件加载 处理本地资源
:::

```js
{
  test: /\.(png|jpe?g|mp3|gif)$/,
    type: 'asset/resource'
}
```

```js
1.处理es6：
  babel-loader
  https://webpack.docschina.org/loaders/babel-loader/
2.处理css：
  css-loader style-loader
  https://webpack.docschina.org/loaders/css-loader/

3.处理sass
  sass-loader
  https://webpack.docschina.org/loaders/sass-loader/

4.文件加载 处理本地资源
  {
    test: /\.(png|jpe?g|mp3|gif)$/,
      type: 'asset/resource'
  }

5.提取css为单独文件
  https://webpack.docschina.org/plugins/mini-css-extract-plugin/

6.拷贝插件
  https://webpack.docschina.org/plugins/copy-webpack-plugin/
```


::: tip
前端模块化打包工具
:::

目前主流的前端工程化解决方案：

-  webpack（ https://www.webpackjs.com/ ）
-  parcel（ https://zh.parceljs.org/ ）

1. 运行 npm init –y 命令，初始化包管理配置文件 package.json
2. 新建 src 源代码目录
3. 新建 src -> index.html 首页和 src -> index.js 脚本文件
4. 初始化首页基本的结构
5. 运行 npm install jquery –S 命令，安装 jQuery
6. 通过 ES6 模块化的方式导入 jQuery

-------------------------------

## 启动安装webpack

安装webpack首先需要安装Node.js，Node.js自带了软件包管理工具npm

查看自己的node版本：

::: tip
node -v
:::

全局安装webpack(这里我先指定版本号3.6.0，因为vue cli2依赖该版本)

::: tip
npm install webpack@3.6.0 -g 全局安装
:::

局部安装webpack（后续才需要）

- `--save-dev`是**开发时依赖**，项目打包后不需要继续使用的。

::: tip
cd 对应目录
npm install webpack@3.6.0 --save-dev
:::

- 为什么全局安装后，还需要局部安装呢？
  - 在终端直接执行webpack命令，使用的全局安装的webpack
  - 当在package.json中定义了scripts时，其中包含了webpack命令，那么使用的是局部webpack

## js文件的打包 (全局)

::: tip
把src开发的包  打包给dist  然后直接**使用打包后的js**即可
webpack src/main.js dist/main.js
:::

## 局部使用webpack打包

![img](/vue/vue-note/image-20211012112521026.png)



## 入口和出口 创建 `webpack.config.js`

1. 我们考虑一下，如果每次使用webpack的命令都需要写上入口和出口作为参数，就非常麻烦，有没有一种方法可以将这两个参数写到配置中，在运行时，直接读取呢？

2. 当然可以，就是**创建一个webpack.config.js文件**

![img](/vue/vue-note/image-20211012111752010.png)

::: tip
这里**全局**的话直接webpack即可
:::

## `package.json` 中定义启动

::: tip
使用 `run` 之前 需要 `npm init` 来初始化 **(在当前项目中执行)**
:::

- package.json中的scripts的脚本在执行时，会按照一定的顺序寻找命令对应的位置。

  - 首先，会寻找本地的node_modules/.bin路径中对应的命令。
  - 如果没有找到，会去全局的环境变量中寻找。
  - 如何执行我们的build指令呢？

  > npm run bulid

::: tip
在 `scripts` 中 可以定义 **bulid脚本**  
以后就可以使用 `npm run bulid` 来打包
:::

![img](/vue/vue-note/image-20211012113137364.png)

## 安装/使用 `loader`

::: tip
在webpack官网中有的  c/v代码即可
:::



### css的 `loader`

::: tip
安装 npm install --save-dev css-loader
配置 webpack.config.js
:::

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        // css-loader只负责将css文件进行加载
        // style-loader负责将样式添加到DOM中
        // 使用多个loader时, 是从右向左
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}
```

## less的 `loader`

::: tip
安装 npm install --save-dev less-loader less
配置 webpack.config.js
:::

```js
module.exports = {
  module: {
    rules: [
      {//这个数组里面是对象  第一个对象是css的配置  
        test: /\.css$/,
        // css-loader只负责将css文件进行加载
        // style-loader负责将样式添加到DOM中
        // 使用多个loader时, 是从右向左
        use: ['style-loader', 'css-loader']
      },
      {	//第二个对象是less的配置
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      }
    ]
  }
}
```

## **图片文件**处理

::: tip
第一步
:::

![img](/vue/vue-note/image-20211016212447943.png)

::: tip
第二步
:::

![img](/vue/vue-note/image-20211016212501301.png)

::: tip
第三步
:::

![img](/vue/vue-note/image-20211016212513285.png)

::: tip
修改文件的名称
:::

![img](/vue/vue-note/image-20211016212522809.png)

## **ES6**语法处理

::: tip
npm install -D babel-loader @babel/core @babel/preset-env
:::

![img](/vue/vue-note/image-20211016220945613.png)

## 配置 `Vue` 

![img](/vue/vue-note/image-20211018214824951.png)

![img](/vue/vue-note/image-20211018214901925.png)

## **Vue文件**的封装处理

::: tip
npm install vue-loader vue-template-compiler --save-dev
:::

::: tip
runtime-only 更简单
:::

![img](/vue/vue-note/image-20211019221038791.png)

![img](/vue/vue-note/image-20211019221046428.png)

## **Plugin**

![imgimage-20211026220420171](/vue/vue-note/image-20211026220420171.png)

### 打包html的`plugin`

::: tip
npm install html-webpack-plugin --save-dev
:::

![imgimage-20211026222536016](/vue/vue-note/image-20211026222536016.png)

### js压缩的`plugin`

::: tip
npm install uglifyjs-webpack-plugin@1.1.1 --save-dev
:::

![imgimage-20211026230338644](/vue/vue-note/image-20211026230338644.png)

## 搭建本地服务器

::: tip
npm install --save-dev webpack-dev-server@2.9.1
:::

![imgimage-20211026232554698](/vue/vue-note/image-20211026232554698.png)

