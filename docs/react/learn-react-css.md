---
title: react使用css
date: 2023-01-06
sidebar: 'auto'
tags:
 - 笔记
 - css
categories:
 - react
---

## 组件化的CSS

- 在组件化中选择合适的CSS解决方案应该符合以下条件：
  - 可以编写局部css：css具备自己的具备作用域，不会随意污染其他组件内的元素
  - 可以编写动态的css：可以获取当前组件的一些状态，根据状态的变化生成不同的css样式
  - 支持所有的css特性：伪类、动画、媒体查询等
  - 编写起来简洁方便、最好符合一贯的css风格特点
  - ...

## 内联样式

- 内联样式是官方推荐的一种css样式的写法：
  - style 接受一个采用小驼峰命名属性的 JavaScript 对象，，而不是 CSS 字符串
  - 并且可以引用state中的状态来设置相关的样式
- 内联样式的优点:
  - 内联样式, 样式之间不会有冲突
  - 可以动态获取当前state中的状态
- 内联样式的缺点：
  - 写法上都需要使用驼峰标识
  - 某些样式没有提示
  - 大量的样式, 代码混乱
  - 某些样式无法编写(比如伪类/伪元素)

```js
render() {
  const { titleSize } = this.state
  return (
    <div>
     <button onClick={e => this.addTitleSize()}>增加titleSize</button>
     <h2 style={{color: "red", fontSize: `${titleSize}px`}}>我是标题</h2>
     <p style={{color: "blue", fontSize: "20px"}}>我是内容, 哈哈哈</p>
    </div>
  )
}
```

## 普通的css

- 普通的css通常会编写到一个单独的文件，之后再进行引入
- 这样的编写方式和普通的网页开发中编写方式是一致的：
  - 如果我们按照普通的网页标准去编写，那么也不会有太大的问题；
  - 但是组件化开发中我们总是希望组件是一个独立的模块，即便是样式也只是在自己内部生效，不会相互影响；
  - 但是普通的css都属于全局的css，样式之间会相互影响；
- 这种编写方式最大的问题是样式之间会相互层叠掉

## css modules

- css modules并不是React特有的解决方案，而是所有使用了类似于webpack配置的环境下都可以使用的。	
  - 如果在其他项目中使用它，那么我们需要自己来进行配置，比如配置webpack.config.js中的modules: true等
- React的脚手架已经内置了css modules的配置：
  - .css/.less/.scss 等样式文件都需要修改成 .module.css/.module.less/.module.scss 等
- 但是这种方案也有自己的缺陷：
  - 引用的类名，不能使用连接符(.home-title)，在JavaScript中是不识别的
  - 所有的className都必须使用{style.className} 的形式来编写
  - 不方便动态来修改某些样式，依然需要使用内联样式的方式

```js
import React, { PureComponent } from 'react'
import Home from './home/Home'
import Profile from './profile/Profile'

import appStyle from "./App.module.css"

export class App extends PureComponent {
  render() {
    return (
      <div>
        <h2 className={appStyle.title}>我是标题</h2>
        <p className={appStyle.content}>我是内容, 哈哈哈哈</p>

        <Home/>
        <Profile/>
      </div>
    )
  }
}

export default App
```

## CSS in JS

- 官方文档也有提到过CSS in JS这种方案：
  - CSS-in-JS 是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部文件中定义
  - 此功能并不是 React 的一部分，而是由第三方库提供
  - React 对样式如何定义并没有明确态度
- 在传统的前端开发中，我们通常会将结构（HTML）、样式（CSS）、逻辑（JavaScript）进行分离
  - 但是在前面的学习中，React的思想中认为逻辑本身和UI是无法分离的，所以才会有了JSX的语法
  - 样式也是属于UI的一部分
  - 事实上CSS-in-JS的模式就是一种将样式（CSS）也写入到JavaScript中的方式，并且可以方便的使用JavaScript的状态
  - 所以React有被人称之为 All in JS

### styled-components

- `CSS-in-JS`通过`JavaScript`来为CSS赋予一些能力，包括类似于CSS预处理器一样的**样式嵌套、函数定义、逻辑复用、动态修**
  **改状态**等等
- 虽然CSS预处理器也具备某些能力，但是获取动态状态依然是一个不好处理的点
- 所以，目前可以说CSS-in-JS是React编写CSS最为受欢迎的一种解决方案
- 前比较流行的CSS-in-JS的库有哪些
  - styled-components
  - emotion
  - glamorous

### styled的基本使用

- styled-components的本质是通过函数的调用，最终创建出一个组件
  - 这个组件会被自动添加上一个不重复的class
  - styled-components会给该class添加相关的样式
- 另外，它支持类似于CSS预处理器一样的样式嵌套
  - 支持直接子代选择器或后代选择器，并且直接编写样式
  - 可以通过&符号获取当前元素
  - 直接伪类选择器、伪元素等

App.js

```js
import React, { PureComponent } from 'react'
import Home from './home'
import { AppWrapper, SectionWrapper } from "./style"

export class App extends PureComponent {

  constructor() {
    super()

    this.state = {
      size: 30,
      color: "yellow"
    }
  }

  render() {
    const { size } = this.state

    return (
      <AppWrapper>
        <SectionWrapper size={size}>
          <h2 className='title'>我是标题</h2>
          <p className='content'>我是内容, 哈哈哈</p>
          <button onClick={e => this.setState({color: "skyblue"})}>修改颜色</button>
        </SectionWrapper>

        <Home/>

        <div className='footer'>
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    )
  }
}

export default App
```

style.js

```js
import styled from "styled-components"
import {
  primaryColor,
  largeSize
} from "./style/variables"

// 1.基本使用
export const AppWrapper = styled.div`
  .footer {
    border: 1px solid orange;
  }
`

// const obj = {
//   name: (props) => props.name || "why"
// }


// 2.子元素单独抽取到一个样式组件
// 3.可以接受外部传入的props
// 4.可以通过attrs给标签模板字符串中提供的属性
// 5.从一个单独的文件中引入变量
export const SectionWrapper = styled.div.attrs(props => ({
  tColor: props.color || "blue"
}))`
  border: 1px solid red;

  .title {
    font-size: ${props => props.size}px;
    color: ${props => props.tColor};

    &:hover {
      background-color: purple;
    }
  }

  .content {
    font-size: ${largeSize}px;
    color: ${primaryColor};
  }
`
```

## styled高级特性

- 支持样式的继承

  ```js
  import styled from "styled-components";
  // 创建一个button
  const HYButton = styled.button`
    border: 1px solid red;
    border-radius: 5px;
  `
  
  export const HYButtonWrapper = styled(HYButton)`
    background-color: #0f0;
    color: #fff;
  `
  
  export const HomeWrapper = styled.div`
    .top {
      .banner {
        color: red;
      }
    }
  
    .bottom {
      .header {
        color: ${props => props.theme.color};
        font-size: ${props => props.theme.size};
      }
  
      .product-list {
        .item {
          color: blue;
        }
      }
    }
  `
  ```

- styled设置主题

  ```js
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { ThemeProvider } from "styled-components"
  
  import App from "./05_CSS_in_js写法/App";
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={{ color: "purple", size: "50px" }}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  ```

  ```js
  import styled from "styled-components";
  export const HomeWrapper = styled.div`
    .top {
      .banner {
        color: red;
      }
    }
  
    .bottom {
      .header {
        color: ${props => props.theme.color};
        font-size: ${props => props.theme.size};
      }
  
      .product-list {
        .item {
          color: blue;
        }
      }
    }
  `
  ```

  

  









