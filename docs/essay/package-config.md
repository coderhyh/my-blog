---
title: package.json 配置
date: 2022-07-18
sidebar: 'auto'
tags:
 - 资料
categories:
 - 随笔
---

## package.json字段

### name

如果项目是需要发版为npm包的，则`name`字段是必须的。
因为它涉及到npm包的命名。

如果项目是不需要发版成npm包的，则`name`字段是可选的，不一定要设置。

- name命名规范
  - `name`字符串长度，必须小于或等于214个字符。
  - 同一作用域内的包，可以用`.`或`_`作为开始字符
  - 不能使用大写字母命名
  - 因为`name`字段，在下载npm包时，会应用于`url`中，所以不能带任何不安全的URL字符。

- 不安全的URL字符
  - 空格`" "`
  - 大于小于号`<>`
  - 方括号`[]`
  - 花括号`{}`
  - 竖线`|`
  - 反斜杠`\`
  - 插入号`^`
  - 百分比`%`

**私源npm包怎么命名？**

格式：`@[scope]/[name]`。

举个例子：

笔者想要发布个私源是`@coderhyh`，包名是`ping-url`的包，则`name`需要命名为：`@coderhyh/ping-url`。

安装命令：`npm install @coderhyh/ping-url`。

### version --- 定义版本号

`version`字段用于定义版本号。

如果项目是为发布npm包，则必须包含此字段。如果是普通的项目，则此字段是可选的。

每次发布的`version`，必须是唯一的，之前发布的时候没使用过的。
 `version` 的命名规则和注意点，可以参考[package.json怎么管理依赖包版本？](https://juejin.cn/post/7108688424818704398)

### description --- 描述

`description`用于描述当前项目的概况。
发布的npm包，在搜索结果中，可以直接显示`description`内容，方便使用方直接了解包的功能。

### keywords --- 关键词

图中标签在`package.json`中对应的定义：

```json
"keywords": [
  "ping url",
  "ping host",
  "ping"
]
```

`keywords`是标签，用于标记当前项目的重点词汇。同时，可以作为搜索关键词，提供给资源平台使用，进行索引。

### homepage --- 项目的官网

项目的官网主页地址

```json
"homepage": ""
```

项目有对应官网地址的话，可以在`homepage`中声明。如果没有的话，也可以放个github项目源码入口

### repository --- 源码地址

项目的源码地址

```json
"repository": {
  "type": "git",
  "url": ""
}
```

开源项目，这个字段很重要
因为有意向的协作者，可以通过字段信息，便捷地进入查看项目源码

### license --- 协议类型

项目的协议类型

这个项目涉及到知识产权方面的知识。所以开源项目的时候，要重点考虑到底要用哪个协议，而不是无脑用`MIT`。 

具体的可选协议列表，可查看[SPDX License List](https://link.juejin.cn/?target=https%3A%2F%2Fspdx.org%2Flicenses%2F)

### author --- 作者

```json
"author": {
  "name": "coderhyh",
  "email": "772567615@qq.com",
  "url": "https://coderhyh.top"
}
```

### contributors --- 协作者

协作者信息

格式是一个对象数组。对象内容和`author`一致

```json
"contributors": [{
  "name": "aa",
  "email": "11@qq.com"
},{
  "name": "bb",
  "email": "22@qq.com"
}]
```

### files

声明有哪些文件，是需要作为依赖项，保留下来。
不然，执行`npm publish`进行发布时，这些文件是会自动屏蔽上传的。
同理，也可以使用`.npmignore`文件进行配置。

```json
"files": [
  "dist/*.js",
  "lib"
]
```

如果没有`files`字段声明，则这些文件，都不会保留，npm包将不能使用

### main

使用npm包时，需要进行`require(..)`的操作。这个操作，会查看`main`字段，找到程序的主入口。

### bin

工具性质的npm包，一定有`bin`字段，对外暴露脚本命令。

举个例子

```json
"bin": {
  "npg-cli": "bin/cli"
}
```

使用方安装`npm-test-cli`包后，`npg-cli`命令会进行注册，可以在`CMD`中识别并运行。

### scripts

项目脚本命令

### private

`private`和发布npm包相关

当`private: true`时，npm会拒绝发布当前项目。这是防止意外发布个人仓库的一种保护方式

### publishConfig

用于定义发布npm时，设置相关信息。

```json
"publishConfig": {
  "registry": "http://127.0.0.1",
  "access": "public",
  "tag": "leon-tag"
}
```

- `registry` 发布的npm私源地址
- `access` 发布有作用域的包（比如`@leon/ping-url`），必须要设置`access`。
- `tag` 指定当前版本对应的标签

**信息可以在 versions/Current Tags 查看**

::: tip

如果没有显式指定tag，默认tag是`latest`

:::

### types

项目如果是用`TypeScript`写的，则需要`types`字段，对外暴露相关的类型定义。

### module

性质等同于`main`字段。`module`用于ES6规范的模块，只要支持ES6，会优先使用`module`入口。
这样，代码也可以启用`tree shaking`机制。

### unpkg

CDN方式下，引入当前npm包的链接。

### sideEffects

`sideEffects`格式：`boolean | string[]`。

`sideEffects: false`用于告知打包工具（webpack），当前项目`无副作用`，可以使用`tree shaking`优化。

`sideEffects`的值，也可以是一个文件路径组成的数组。告知哪些文件`无副作用`，可以使用`tree shaking`优化。

```json
"sideEffects": [
  "a.js",
  "b.js"
]
```

::: warning

`"import xxx;"`语句，只引入未使用，如果声明了sideEffects，则会被`tree shaking`删除掉。

并且，由于`tree shaking`只在`production`模式生效，所以本地开发会一切正常，生产环境很难及时发现这个问题。

当然， 样式文件使用`"import xxx;"`的方式引入，会进行保留。

:::

### engines

项目运行环境的要求声明。

```json
"engines": {
  "node": ">=0.10.3 <15"
}
```

告知node版本需要在`0.10.3`与`15`之间，才可以运行当前项目。
在不符合条件的环境中运行项目时，控制台会有报错输出。

### os

操作系统的要求声明。

```json
"os": [
  "darwin",
  "linux"
]
```

### cpu

CPU的要求声明。

```json
"cpu": [
  "x64",
  "ia32"
]
```

### workspaces

`monorepo`类型的项目，需要用到`workspaces`。它可以告知其他工具，当前项目的工作区间在哪里。

```json
{
  "name": "workspace-example",
  "workspaces": [
    "./packages/*"
  ]
}
```

### bugs

开源项目用于接收bug反馈。

```json
{
  "url" : "http://127.0.0.1",
  "email" : "772567615@qq.com"
}
```

### dependencies

### devDependencies

### peerDependencies



