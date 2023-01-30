---
title: react如何使用less
date: 2022-02-19
sidebar: 'auto'
tags:
 - 随笔
categories:
 - react
 - 资料
---

安装 `npm i less less-loader -D`

首先需要暴露出`webpack`的配置文件

`npm run eject`

::: tip

**报错的话**：

如果有 `git` 的需要 `git add .` `git commit -m "说明"`

不使用 `git` 的可以直接把 `.git` 文件删了

:::

::: warning 

使用`create-react-app`创建的项目默认是看不到`webpack`配置文件的

需要先暴露出来，然后才能修改里面的配置信息。

（**注意：此命令一旦运行会修改package.json 文件，不可回退**）

:::

**接着修改webpack配置文件**

运行完以上命令后，项目根目录下会多出一个 `config` 文件夹，找到里面的 `webpack.config.js` 这个文件

然后在`sass`配置后面加上

```js
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
//在这里添加less正则
const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;
```

最后搜索 `sassRegex` 与其同级添加上

```js
{
  test: lessRegex,
    exclude: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction
          ? shouldUseSourceMap
          : isEnvDevelopment,
        },
        'less-loader',
        {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1DA57A' },
          }
        }
      ),
        sideEffects: true,
},
  {
    test: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction
          ? shouldUseSourceMap
          : isEnvDevelopment,
          // modules: true,
          // getLocalIdent: getCSSModuleLocalIdent,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
          },
        },
        'less-loader',
        {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1DA57A' },
          }
        }
      ),
  },

```

之后重启一下就大功告成啦！😊

::: warning

这种方式必须使用私有化的less才可以！！！[传送门！](/docs/react/react-note(deprecated).html#%E7%A7%81%E6%9C%89%E5%8C%96css)

:::