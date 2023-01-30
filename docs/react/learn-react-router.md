---
title: learn-router
date: 2023-01-20
sidebar: 'auto'
tags:
 - 笔记
categories:
 - react
---

## 认识前端路由

- 路由其实是网络工程中的一个术语：
  - 在架构一个网络时，非常重要的两个设备就是路由器和交换机
  - 当然，目前在我们生活中路由器也是越来越被大家所熟知，因为我们生活中都会用到路由器
  - 事实上，路由器主要维护的是一个映射表
  - 映射表会决定数据的流向
- 路由的概念在软件工程中出现，最早是在后端路由中实现的，原因是web的发展主要经历了这样一些阶段
  - 后端路由阶段
  - 前后端分离阶段
  - 单页面富应用（SPA）

### 后端路由阶段

- 早期的网站开发整个HTML页面是由服务器来渲染的
  - 服务器直接生产渲染好对应的HTML页面, 返回给客户端进行展示
- 但是, 一个网站, 这么多页面服务器如何处理呢
  - 一个页面有自己对应的网址, 也就是URL
  - URL会发送到服务器, 服务器会通过正则对该URL进行匹配, 并且最后交给一个Controller进行处理
  - Controller进行各种处理, 最终生成HTML或者数据, 返回给前端
- 上面的这种操作, 就是后端路由
  - 当我们页面中需要请求不同的路径内容时, 交给服务器来进行处理, 服务器渲染好整个页面, 并且将页面返回给客户端
  - 这种情况下渲染好的页面, 不需要单独加载任何的js和css, 可以直接交给浏览器展示, 这样也有利于SEO的优化
- 后端路由的缺点
  - 一种情况是整个页面的模块由后端人员来编写和维护的
  - 另一种情况是前端开发人员如果要开发页面, 需要通过PHP和Java等语言来编写页面代码
  - 而且通常情况下HTML代码和数据以及对应的逻辑会混在一起, 编写和维护都是非常糟糕的事情

### 前后端分离阶段

- 前端渲染的理解
  - 每次请求涉及到的静态资源都会从静态资源服务器获取，这些资源包括HTML+CSS+JS，然后在前端对这些请求回来的资源进行渲染
  - 需要注意的是，客户端的每一次请求，都会从静态资源服务器请求文件
  - 同时可以看到，和之前的后端路由不同，这时后端只是负责提供API了
- 前后端分离阶段
  - 随着Ajax的出现, 有了前后端分离的开发模式
  - 后端只提供API来返回数据，前端通过Ajax获取数据，并且可以通过JavaScript将数据渲染到页面中
  - 这样做最大的优点就是前后端责任的清晰，后端专注于数据上，前端专注于交互和可视化上
  - 并且当移动端(iOS/Android)出现后，后端不需要进行任何处理，依然使用之前的一套API即可
  - 目前比较少的网站采用这种模式开发
- 单页面富应用阶段
  - 其实SPA最主要的特点就是在前后端分离的基础上加了一层前端路由
  - 也就是前端来维护一套路由规则
- **前端路由的核心是什么呢？改变URL，但是页面不进行整体的刷新**

### URL的hash

- 前端路由是如何做到URL和内容进行映射呢？监听URL的改变
- URL的hash
  - URL的hash也就是锚点(#), 本质上是改变`window.location`的href属性
  - 我们可以通过直接赋值`location.hash`来改变href, 但是页面不发生刷新
- hash的优势就是兼容性更好，在老版IE中都可以运行，但是缺陷是有一个#，显得不像一个真实的路径

### HTML5的History

- history接口是HTML5新增的, 它有六种模式改变URL而不刷新页面
  - replaceState：替换原来的路径；
  - pushState：使用新的路径；
  - popState：路径的回退；
  - go：向前或向后改变路径；
  - forward：向前改变路径；
  - back：向后改变路径；

## react-router的基本使用

- 安装

  - 安装时，我们选择react-router-dom
  - react-router会包含一些react-native的内容，web开发并不需要

  `npm install react-router-dom`

- react-router最主要的API是给我们提供的一些组件

- BrowserRouter或HashRouter

  - Router中包含了对路径改变的监听，并且会将相应的路径传递给子组件
  - BrowserRouter使用history模式
  - HashRouter使用hash模式

  ```jsx
  <HashRouter>
    <Suspense fallback={<h3>Loading...</h3>}>
      <App/>
    </Suspense>
  </HashRouter>
  ```

## 路由映射配置

- Routes：包裹所有的Route，在其中匹配一个路由

  - Router5.x使用的是Switch组件

- Route：Route用于路径的匹配

  - path属性：用于设置匹配到的路径
  - element属性：设置匹配到路径后，渲染的组件
    - Router5.x使用的是component属性
  - exact：精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件
    - Router6.x不再支持该属性

  ```jsx
  <Routes>
    <Route path='/' element={<Navigate to="/home"/>}/>
    <Route path='/home' element={<Home/>}>
      <Route path='/home' element={<Navigate to="/home/recommend"/>}/>
      <Route path='/home/recommend' element={<HomeRecommend/>}/>
      <Route path='/home/ranking' element={<HomeRanking/>}/>
      <Route path='/home/songmenu' element={<HomeSongMenu/>}/>
    </Route>
    <Route path='/about' element={<About/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/category' element={<Category/>}/>
    <Route path='/order' element={<Order/>}/>
    <Route path='/detail/:id' element={<Detail/>}/>
    <Route path='/user' element={<User/>}/>
    <Route path='*' element={<NotFound/>}/>
  </Routes>
  ```

- router 6.x嵌套路由注意事项
  - 在使用6.x的嵌套路由后需要像vue那样在对应位置加一个占位的组件 `Outlet`

```jsx
import React, { PureComponent } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { withRouter } from "../hoc"

export class Home extends PureComponent {
  navigateTo(path) {
    const { navigate } = this.props.router
    navigate(path)
  }

  render() {
    return (
      <div>
        <h1>Home Page</h1>
        <div className='home-nav'>
          <Link to="/home/recommend">推荐</Link>
          <Link to="/home/ranking">排行榜</Link>
          <button onClick={e => this.navigateTo("/home/songmenu")}>歌单</button>
        </div>

        {/* 占位的组件 */}
        <Outlet/>
      </div>
    )
  }
}

export default withRouter(Home)
```

## 路由配置和跳转

- Link和NavLink
  - 通常路径的跳转是使用Link组件，最终会被渲染成a元素
  - NavLink是在Link基础之上增加了一些样式属性
  - to属性：Link中最重要的属性，用于设置跳转到的路径
  - replace: 是否替换路由
  - reloadDocument：是否重新加载页面
  - state: any

### NavLink的使用

- 需求：路径选中时，对应的a元素变为红色

- 这个时候，我们要使用NavLink组件来替代Link组件

  - style：传入函数，函数接受一个对象，包含isActive属性
  - className：传入函数，函数接受一个对象，包含isActive属性

  ```jsx
  <NavLink to="/home" style={({isActive}) => ({color: isActive ? "red" : ""})}>首页</NavLink>
  <NavLink to="/about" style={({isActive}) => ({color:  isActive ? "red" : ""})}>关于</NavLink>
  
  <NavLink to="/home" className={({isActive}) => isActive ? "link-active" : ""}>首页</NavLink>
  <NavLink to="/about" className={({isActive}) => isActive ? "link-active" : ""}>关于</NavLink>
  ```

- 默认的activeClassName

  - 事实上在默认匹配成功时，NavLink就会添加上一个动态的**active**类名
  - 所以我们也可以直接编写样式

- 如果你担心这个class在其他地方被使用了，出现样式的层叠，也可以自定义class

## Navigate导航

- Navigate用于路由的重定向，当这个组件出现时，就会执行跳转到对应的to路径中

- 栗子

  - 用户登录成功重定向到home页面

  ```jsx
  import React, { PureComponent } from 'react'
  import { Navigate } from 'react-router-dom'
  
  export class Login extends PureComponent {
    constructor(props) {
      super(props)
  
      this.state = {
        isLogin: false
      }
    }
    
    login() {
      this.setState({ isLogin: true })
    }
  
    render() {
      const { isLogin } = this.state
  
      return (
        <div>
          <h1>Login Page</h1>
          {!isLogin ? <button onClick={e => this.login()}>登录</button> : <Navigate to="/home"/>}
        </div>
      )
    }
  }
  
  export default Login
  ```

## 手动路由的跳转

- 目前我们实现的跳转主要是通过Link或者NavLink进行跳转的，实际上我们也可以通过JavaScript代码进行跳转

  - 我们知道Navigate组件是可以进行路由的跳转的，但是依然是组件的方式
  - 如果我们希望通过JavaScript代码逻辑进行跳转（比如点击了一个button），那么就需要获取到navigate对象

- 在Router6.x版本之后，代码类的API都迁移到了hooks的写法

  - 如果我们希望进行代码跳转，需要通过`useNavigate`的Hook获取到`navigate`对象进行操作

  - **那么如果是一个函数式组件，我们可以直接调用，但是如果是一个类组件呢？**

  - 那么就需要封装一个高级组件

    ```jsx
    // withRouter.js
    import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
    
    // 高阶组件: 函数
    function withRouter(WrapperComponent) {
      return function(props) {
        // 1.导航
        const navigate = useNavigate()
    
        // 2.动态路由的参数: /detail/:id
        const params = useParams()
    
        // 3.查询字符串的参数: /user?name=why&age=18
        const location = useLocation()
        const [searchParams] = useSearchParams()
        const query = Object.fromEntries(searchParams)
    
        const router = { navigate, params, location, query }
    
        return <WrapperComponent {...props} router={router}/>
      }
    }
    
    export default withRouter
    ```

## 路由参数传递

- 传递参数有二种方式
  - params
    - 只需像vue一样在配置路由的时候`/detail/:id`这样即可
  - query
    - 在跳转时需要这样写`/user?name=hyh&age=18`

## 路由的配置文件

- 目前我们所有的路由定义都是直接使用Route组件，并且添加属性来完成的

- 但是这样的方式会让路由变得非常混乱，我们希望将所有的路由配置放到一个地方进行集中管理

  - 在早期的时候，Router并且没有提供相关的API，我们需要借助于`react-router-config`完成

  - 在Router6.x中，为我们提供了useRoutes API可以完成相关的配置

    ```jsx
    import { useRoutes } from 'react-router-dom'
    import routes from './router'
    
    <div>{useRoutes(routes)}</div>
    ```

- 配置

  ```jsx
  import Home from '../pages/Home'
  import HomeRecommend from "../pages/HomeRecommend"
  import HomeRanking from "../pages/HomeRanking"
  import HomeSongMenu from '../pages/HomeSongMenu'
  // import About from "../pages/About"
  // import Login from "../pages/Login"
  import Category from "../pages/Category"
  import Order from "../pages/Order"
  import NotFound from '../pages/NotFound'
  import Detail from '../pages/Detail'
  import User from '../pages/User'
  import { Navigate } from 'react-router-dom'
  import React from 'react'
  
  // 路由懒加载
  const About = React.lazy(() => import("../pages/About"))
  const Login = React.lazy(() => import("../pages/Login"))
  
  const routes = [
    {
      path: "/",
      element: <Navigate to="/home"/>
    },
    {
      path: "/home",
      element: <Home/>,
      children: [
        {
          path: "/home",
          element: <Navigate to="/home/recommend"/>
        },
        {
          path: "/home/recommend",
          element: <HomeRecommend/>
        },
        {
          path: "/home/ranking",
          element: <HomeRanking/>
        },
        {
          path: "/home/songmenu",
          element: <HomeSongMenu/>
        }
      ]
    },
    {
      path: "/about",
      element: <About/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/category",
      element: <Category/>
    },
    {
      path: "/order",
      element: <Order/>
    },
    {
      path: "/detail/:id",
      element: <Detail/>
    },
    {
      path: "/user",
      element: <User/>
    },
    {
      path: "*",
      element: <NotFound/>
    }
  ]
  
  export default routes
  ```

- 如果我们对某些组件进行了异步加载（懒加载），那么需要使用`Suspense`进行包裹

  ```jsx
  const About = React.lazy(() => import("../pages/About"))
  const Login = React.lazy(() => import("../pages/Login"))
  ```

  ```jsx
  import { StrictMode } from "react"
  import ReactDOM from "react-dom/client"
  import App from "./App"
  import { HashRouter } from "react-router-dom"
  import { Suspense } from "react"
  
  const root = ReactDOM.createRoot(document.querySelector("#root"))
  root.render(
    <StrictMode>
      <HashRouter>
        <Suspense fallback={<h3>Loading...</h3>}>
          <App/>
        </Suspense>
      </HashRouter>
    </StrictMode>
  )
  ```