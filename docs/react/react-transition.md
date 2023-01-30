---
title: React过渡
date: 2023-01-12
sidebar: 'auto'
tags:
 - 笔记
 - css
categories:
 - react
---

## React过渡动画实现

### react-transition-group介绍

- 在开发中，我们想要给一个组件的显示和消失添加某种过渡动画，可以很好的增加用户体验

- 当然，我们可以通过原生的CSS来实现这些过渡动画，但是React社区为我们提供了`react-transition-group`用来完成过渡动画

- React曾为开发者提供过动画插件 `react-addons-css-transition-group`，后由社区维护，形成了现在的 react-transition-group

  - 这个库可以帮助我们方便的实现组件的 入场 和 离场 动画，使用时需要进行额外的安装

  ```js
  npm install react-transition-group --save
  ```

- react-transition-group本身非常小，不会为我们应用程序增加过多的负担

### react-transition-group主要组件

- `react-transition-group`主要包含四个组件
- `Transition`
  - 该组件是一个和平台无关的组件（不一定要结合CSS）
  - 在前端开发中，我们一般是结合CSS来完成样式，所以比较常用的是`CSSTransition`
- `CSSTransition`
  - 在前端开发中，通常使用`CSSTransition`来完成过渡动画效果
- `SwitchTransition`
  - 两个组件显示和隐藏切换时，使用该组件
- `TransitionGroup`
  - 将多个动画组件包裹在其中，一般用于列表中元素的动画

### CSSTransition

- CSSTransition是基于Transition组件构建的
- CSSTransition执行过程中，有三个状态：appear、enter、exit
- 它们有三种状态，需要定义对应的CSS样式
  - 第一类，开始状态：对于的类是-appear、-enter、exit
  - 第二类：执行动画：对应的类是-appear-active、-enter-active、-exit-active
  - 第三类：执行结束：对应的类是-appear-done、-enter-done、-exit-done
- CSSTransition常见对应的属性
- in：触发进入或者退出状态
  - 如果添加了`unmountOnExit={true}`，那么该组件会在执行退出动画结束后被移除掉
  - 当in为true时，触发进入状态，会添加-enter、-enter-acitve的class开始执行动画，当动画执行结束后，会移除两个class，并且添加-enter-done的class
  - 当in为false时，触发退出状态，会添加-exit、-exit-active的class开始执行动画，当动画执行结束后，会移除两个class，并且添加-enter-done的class
- CSSTransition常见属性
  - classNames：动画class的名称
    - 决定了在编写css时，对应的class名称：比如card-enter、card-enter-active、card-enter-done
  - timeout
    - 过渡动画的时间
  - appear
    - 是否在初次进入添加动画（需要和in同时为true）
  - unmountOnExit：退出后卸载组件
  - 其他属性可以参考官网
    - [http://reactcommunity.org/react-transition-group/transition](http://reactcommunity.org/react-transition-group/transition)
  - CSSTransition对应的钩子函数：主要为了检测动画的执行过程，来完成一些JavaScript的操作
    - onEnter：在进入动画之前被触发
    - onEntering：在应用进入动画时被触发
    - onEntered：在应用进入动画结束后被触发

```js
import React, { createRef, PureComponent } from 'react'
import { CSSTransition } from "react-transition-group"
import "./style.css"

export class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isShow: true
    }

    this.sectionRef = createRef()
  }

  render() {
    const { isShow } = this.state

    return (
      <div>
        <button onClick={e => this.setState({isShow: !isShow})}>切换</button>
        {/* { isShow && <h2>哈哈哈</h2> } */}

        <CSSTransition 
          nodeRef={this.sectionRef}
          in={isShow} 
          unmountOnExit={true} 
          classNames="hyh" 
          timeout={2000}
          appear
          onEnter={e => console.log("开始进入动画")}
          onEntering={e => console.log("执行进入动画")}
          onEntered={e => console.log("执行进入结束")}
          onExit={e => console.log("开始离开动画")}
          onExiting={e => console.log("执行离开动画")}
          onExited={e => console.log("执行离开结束")}
        >
          <div className='section' ref={this.sectionRef}>
            <h2>哈哈哈</h2>
            <p>我是内容, 哈哈哈</p>
          </div>
        </CSSTransition>
      </div>
    )
  }
}

export default App
```

```css
/* 进入动画 */
/* .hyh-appear {
  transform: translateX(-150px);
}

.hyh-appear-active {
  transform: translateX(0);
  transition: transform 2s ease;
} */

.hyh-appear, .hyh-enter {
  opacity: 0;
}

.hyh-appear-active, .hyh-enter-active {
  opacity: 1;
  transition: opacity 2s ease;
}

/* 离开动画 */
.hyh-exit {
  opacity: 1;
}

.hyh-exit-active {
  opacity: 0;
  transition: opacity 2s ease;
}
```

### SwitchTransition

- `SwitchTransition`可以完成两个组件之间切换的炫酷动画
  - 比如我们有一个按钮需要在on和off之间切换，我们希望看到on先从左侧退出，off再从右侧进入
  - 这个动画在vue中被称之为 `vue transition modes`
  - `react-transition-group`中使用`SwitchTransition`来实现该动画
- `SwitchTransition`中主要有一个属性：mode，有两个值
  - in-out：表示新组件先进入，旧组件再移除
  - out-in：表示就组件先移除，新组建再进入
- 如何使用SwitchTransition
  - SwitchTransition组件里面要有CSSTransition或者Transition组件，不能直接包裹你想要切换的组件
  - SwitchTransition里面的CSSTransition或Transition组件不再像以前那样接受in属性来判断元素是何种状态，取而代之的是key属性

```js
import React, { PureComponent } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import "./style.css"

export class App extends PureComponent {
  constructor() {
    super() 

    this.state = {
      isLogin: true
    }
  }

  render() {
    const { isLogin } = this.state

    return (
      <div>
        <SwitchTransition mode='out-in'>
          <CSSTransition
            key={isLogin ? "exit": "login"}
            classNames="login"
            timeout={1000}
          >
            <button onClick={e => this.setState({ isLogin: !isLogin })}>
              { isLogin ? "退出": "登录" }
            </button>
          </CSSTransition>
        </SwitchTransition>
      </div>
    )
  }
}

export default App
```

```css
.login-enter {
  transform: translateX(100px);
  opacity: 0;
}

.login-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}

.login-exit {
  transform: translateX(0);
  opacity: 1;
}

.login-exit-active {
  transform: translateX(-100px);
  opacity: 0;
  transition: all 1s ease;
}
```

### TransitionGroup

- 当我们有一组动画时，需要将这些CSSTransition放入到一个TransitionGroup中来完成动画

```js
import React, { PureComponent } from 'react'
import { TransitionGroup, CSSTransition } from "react-transition-group"
import "./style.css"

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      books: [
        { id: 111, name: "你不知道JS", price: 99 },
        { id: 222, name: "JS高级程序设计", price: 88 },
        { id: 333, name: "Vuejs高级设计", price: 77 },
      ]
    }
  }

  addNewBook() {
    const books = [...this.state.books]
    books.push({ id: new Date().getTime(), name: "React高级程序设计", price: 99 })
    this.setState({ books })
  }

  removeBook(index) {
    const books = [...this.state.books]
    books.splice(index, 1)
    this.setState({ books })
  }

  render() {
    const { books } = this.state

    return (
      <div>
        <h2>书籍列表:</h2>
        <TransitionGroup component="ul">
          {
            books.map((item, index) => {
              return (
                <CSSTransition key={item.id} classNames="book" timeout={1000}>
                  <li>
                    <span>{item.name}-{item.price}</span>
                    <button onClick={e => this.removeBook(index)}>删除</button>
                  </li>
                </CSSTransition>
              )
            })
          }
        </TransitionGroup>
        <button onClick={e => this.addNewBook()}>添加新书籍</button>
      </div>
    )
  }
}

export default App
```

```css
.book-enter {
  transform: translateX(150px);
  opacity: 0;
}

.book-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}

.book-exit {
  transform: translateX(0);
  opacity: 1;
}

.book-exit-active {
  transform: translateX(150px);
  opacity: 0;
  transition: all 1s ease;
}
```