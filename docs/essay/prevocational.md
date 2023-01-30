---
title: 开发前准备
date: 2022-02-13
sidebar: 'auto'
categories:
 - 随笔
---

::: tip
![img](/images/12.png)
:::
<!-- more -->

## 安装vsCode

::: tip

**传送门** [安装vsCode](https://code.visualstudio.com/)

:::

安装完毕之后 可以下载插件 `Chinese` 来转换为中文
### vsCode常用插件

**Auto Close Tag** --- 自动关闭标签

**Auto Rename Tag** --- 自动重命名标签

**Beautify** --- 美化代码

**ES7+ React/Redux/React-Native snippets** --- 代码片段提示

**Git Graph** --- git管理

**HTML CSS Support** --- HTML CSS支持

**HTML Snippets** --- html片段提示

**Icon Fonts** --- 图标

**JavaScript (ES6) code snippets** --- es6片段提示

**Live Server** --- 本地服务器

**open in browser** --- 网页预览

**Path Intellisense** --- 路劲补全

**Power Mode** --- 炫酷模式

**px to rem & rpx (cssrem)** --- px to rem

**SVG** --- svg

**Vetur** --- vue美化

**Vue 3 Snippets** --- vue3片段提示

**Vue VSCode Snippets** --- vue片段提示

**Easy LESS** --- less

## 安装nodejs

::: tip

传送门 <a href="/file/node-v16.14.0-x64.zip" download="node-v16.14.0-x64.zip">点我下载🥰</a>

安装完毕可以 `node -v` 查看版本

详细可以看 [nodejs文档](/docs/nodejs/nodejs-note.html) 

:::

## 更改npm镜像

**临时使用**

`npm --registry https://registry.npm.taobao.org install express`

**永久使用**

`npm config set registry https://registry.npm.taobao.org`

**通过以下命令查看是否配置成功**

```tex
npm config get registry
npm info express
```

::: tip

如果需要恢复成原来的官方地址只需要执行如下命令:

`npm config set registry https://registry.npmjs.org` 

:::

::: tip

如果想要下载 `sass` 想要更改镜像 可以查看 [sass安装](/docs/essay/preprocessor.html#sass)

:::

### 安装基本的模块

::: tip

**webpack**

`npm install webpack -g` 全局安装

详细可以看 [webpack文档](/docs/webpack/webpack-note.html#%E5%90%AF%E5%8A%A8%E5%AE%89%E8%A3%85webpack) 

:::

::: tip

**Vue CLI**

安装 `npm install -g @vue/cli`

创建项目 `vue create project` 

:::

## 安装git

:::tip 

传送门 <a href="/file/Git-2.35.1.2-64-bit.zip" download="Git-2.35.1.2-64-bit.zip">点我下载🥰</a>

详细命令可以看 [git常用命令](/docs/git/git-note.html) 

:::
