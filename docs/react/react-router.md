---
title: react路由
date: 2022-02-22
sidebar: 'auto'
tags:
 - 笔记
categories:
 - react
---

## Router

::: tip

安装

`npm i react-router-dom@5.1.2` 

:::


## 基本使用


**匹配路径渲染指定的路由组件 (判断)**

```jsx
// 可以使用params传参
<Route path="/index/:id" component={Index}/>
```

**`Link` 解析成 `a标签` 控制页面跳转**
**`NavLink` 解析成 `a标签` 控制页面跳转 (会额外添加类名 `active`)**

```jsx
<Link to="/">首页</Link>
<NavLink to="/">首页</NavLink>
```

**使用 `Redirect` 重定向**

```jsx
<Redirect to="/"/>
```

**确保只渲染一个组件**

```jsx
<Switch>这里放路由</Switch>
```

**往普通组件的 `props` 中注入路由对象**

```jsx
let Btn=({match})=>{
  console.log(match);
  return <button>按钮</button>
}
Btn=withRouter(Btn);
```

**路由 use 的方法**

```jsx
useParams // 获取路由中的参数
useRouteMatch // 获取路由信息对象
useHistory // 控制路由跳转的方法
useLocation // 获取活跃的路由
```

## 路由懒加载

首先引入需要的方法

```jsx
import React, { lazy, Suspense } from 'react';
```

引入组件是需要这样的

```jsx
const Index = lazy(() => import('./Index/index'))
```

使用的时候 只需用 `Suspense` 把路由包裹起来 并且可以自定义 `loading` 的

```jsx
<Suspense fallback={<div>我是Loading...</div>}>
  <Switch>
    <Route path="/page/index" component={Index} />
    //重定向
    <Redirect to="/page/index" />
  </Switch>
</Suspense>
```

