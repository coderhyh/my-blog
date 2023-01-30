---
title: react笔记
date: 2022-12-23
sidebar: 'auto'
tags:
 - 笔记
categories:
 - react
---



## JSX语法

- JSX是什么？
  - JSX是一种JavaScript的语法扩展（eXtension），也在很多地方称之为JavaScript XML，因为看起就是一段XML语法
  - 它用于描述我们的UI界面，并且其完成可以和JavaScript融合在一起使用
  - 它不同于Vue中的模块语法，你不需要专门学习模块语法中的一些指令（比如v-for、v-if、v-else、v-bind）

- JSX的书写规范
  - JSX的顶层只能有一个根元素，所以我们很多时候会在外层包裹一个div元素（或者使用Fragment）
  - 为了方便阅读，我们通常在jsx的外层包裹一个小括号()，这样可以方便阅读，并且jsx可以进行换行书写
  - JSX中的标签可以是单标签，也可以是双标签
    - 注意：如果是单标签，必须以/>结尾

### JSX的使用

- jsx中的注释
  - `{ /* 注释 */ }`
- JSX嵌入变量作为子元素
  - 情况一：当变量是Number、String、Array类型时，可以直接显示
  - 情况二：当变量是null、undefined、Boolean类型时，内容为空
    - 如果希望可以显示null、undefined、Boolean，那么需要转成字符串
  - 情况三：Object对象类型不能作为子元素（not valid as a React child）
- JSX嵌入表达式
  - 运算表达式
  - 三元运算符
  - 执行一个函数

### JSX的本质

- 实际上，jsx 仅仅只是 React.createElement(component, props, ...children) 函数的语法糖
  - 所有的jsx最终都会被转换成React.createElement的函数调用

createElement需要传递三个参数: 

- 参数一：type
  - 当前ReactElement的类型
  - 如果是标签元素，那么就使用字符串表示 “div“
  - 如果是组件元素，那么就直接使用组件的名称
- 参数二：config
  - 所有jsx中的属性都在config中以对象的属性和值的形式存储
  - 比如传入className作为元素的class
- 参数三：children
  - 存放在标签中的内容，以children数组的方式进行存储

::: tip

可以在babel的官网中快速查看转换的过程：https://babeljs.io/repl/#?presets=react

所以流程就是: **jsx –> 虚拟DOM –> 真实DOM**

:::

### 声明式编程

- **虚拟DOM帮助我们从命令式编程转到了声明式编程的模式**
- React官方的说法：Virtual DOM 是一种编程理念
  - 在这个理念中，UI以一种理想化或者说虚拟化的方式保存在内存中，并且它是一个相对简单的JavaScript对象
  - 我们可以通过ReactDOM.render让 虚拟DOM 和 真实DOM同步起来，这个过程中叫做协调（Reconciliation）
- 这种编程的方式赋予了React声明式的API：
  - 你只需要告诉React希望让UI是什么状态
  - React来确保DOM和这些状态是匹配的
  - 你不需要直接进行DOM操作，就可以从手动更改DOM、属性操作、事件处理中解放出来

## 了解PWA

- PWA全称Progressive Web App，即渐进式WEB应用
- 一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用
- 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能
- 这种Web存在的形式，我们也称之为是 Web App
- PWA解决了哪些问题呢？
  - 可以添加至主屏幕，点击主屏幕图标可以实现启动动画以及隐藏地址栏
  - 实现离线缓存功能，即使用户手机没有网络，依然可以使用一些离线功能
  - 实现了消息推送
  - 等等一系列类似于Native App相关的功能
- 更多PWA相关的知识，可以自行去学习更多
  - https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps

## React的组件化

- 组件化思想的应用
  - 有了组件化的思想，我们在之后的开发中就要充分的利用它
  - 尽可能的将页面拆分成一个个小的、可复用的组件
  - 这样让我们的代码更加方便组织和管理，并且扩展性也更强
- React的组件相对于Vue更加的灵活和多样，按照不同的方式可以分成很多类组件
  - 根据组件的定义方式，可以分为：函数组件(Functional Component )和类组件(Class Component)
  - 根据组件内部是否有状态需要维护，可以分成：无状态组件(Stateless Component )和有状态组件(Stateful Component)
  - 根据组件的不同职责，可以分成：展示型组件(Presentational Component)和容器型组件(Container Component)
- 这些概念有很多重叠，但是他们最主要是关注数据逻辑和UI展示的分离
  - 函数组件、无状态组件、展示型组件主要关注UI的展示
  - 类组件、有状态组件、容器型组件主要关注数据逻辑
- 还有很多组件的其他概念：比如异步组件、高阶组件

### 类组件

- 类组件的定义有如下要求：
  - 组件的名称是大写字符开头（无论类组件还是函数组件）
  - 类组件需要继承自React.Component
  - 类组件必须实现render函数
- 在ES6之前，可以通过create-react-class模块来定义类组件，但是目前官网建议我们使用ES6的class类定义
- 使用class定义一个组件:
  - constructor是可选的，我们通常在constructor中初始化一些数据
  - this.state中维护的就是我们组件内部的数据
  - render() 方法是class 组件中唯一必须实现的方法

#### render函数的返回值

- 当render 被调用时，它会检查this.props和this.state 的变化并返回以下类型之一：
- React 元素：
  - 通常通过JSX 创建
  - 例如，`<div />`会被React 渲染为DOM 节点，`<MyComponent/>`会被React 渲染为自定义组件
  - 无论是`<div />`还是`<MyComponent/>`均为React 元素

- 数组或fragments：使得render 方法可以返回多个元素
- Portals：可以渲染子节点到不同的DOM 子树中
- 字符串或数值类型：它们在DOM 中会被渲染为文本节点
- 布尔类型或null：什么都不渲染

### 函数组件

- 函数组件是使用function来进行定义的函数，只是这个函数会返回和类组件中render函数返回一样的内容
- 函数组件有自己的特点（当然，跟hooks相比，就不一样了）
  - 没有生命周期，也会被更新并挂载，但是没有生命周期函数
  - this关键字不能指向组件实例（因为没有组件实例）
  - 没有内部状态（state）

## 认识生命周期

- 很多的事物都有从创建到销毁的整个过程，这个过程称之为是生命周期
- React组件也有自己的生命周期，了解组件的生命周期可以让我们在最合适的地方完成自己想要的功能
- 生命周期和生命周期函数的关系：
- 生命周期是一个抽象的概念，在生命周期的整个过程，分成了很多个阶段
  - 比如装载阶段（Mount），组件第一次在DOM树中被渲染的过程
  - 比如更新过程（Update），组件状态发生变化，重新更新渲染的过程
  - 比如卸载过程（Unmount），组件从DOM树中被移除的过程
- React内部为了告诉我们当前处于哪些阶段，会对我们组件内部实现的某些函数进行回调，这些函数就是生命周期函数
  - 比如实现componentDidMount函数：组件已经挂载到DOM上时，就会回调
  - 比如实现componentDidUpdate函数：组件已经发生了更新时，就会回调
  - 比如实现componentWillUnmount函数：组件即将被移除时，就会回调
  - 我们可以在这些回调函数中编写自己的逻辑代码，来完成自己的需求功能

### 生命周期解析

![img](/react/ogimage.png)

完整图谱

![image-20221227140812332](/react/image-20221227140812332.png)

::: tip

更详细的可以查看[官网声明周期](https://zh-hans.reactjs.org/docs/react-component.html)

:::

## 组件通信

### 参数propTypes

- 对于传递给子组件的数据，有时候我们可能希望进行验证
  - 如果你项目中默认继承了Flow或者TypeScript，那么直接就可以进行类型验证
  - 即使我们没有使用Flow或者TypeScript，也可以通过prop-types库来进行参数验证
- 从React v15.5 开始，React.PropTypes 已移入另一个包中：prop-types库

```js
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的必需数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `oneOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### 默认 Prop 值

```js
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};

// 渲染出 "Hello, Stranger"：
const root = ReactDOM.createRoot(document.getElementById('example')); 
root.render(<Greeting />);
```

从 ES2022 开始，你也可以在 React 类组件中将 `defaultProps` 声明为静态属性。欲了解更多信息，请参阅 [class public static fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_static_fields)。这种现代语法需要添加额外的编译步骤才能在老版浏览器中工作

```js
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

::: tip

更多的验证方式，可以参考[官网](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html)

:::

### Context相关API

- React.createContext([defaultValue])

  - 创建一个需要共享的Context对象

  - 如果一个组件订阅了Context，那么这个组件会从离自身最近的那个匹配的Provider 中读取到当前的context值

  - defaultValue是组件在顶层查找过程中没有找到对应的Provider，那么就使用默认值

    ```js
    import React from "react"
    // 1.创建一个Context
    const ThemeContext = React.createContext({ color: "blue", size: 10 })
    export default ThemeContext
    ```

- Context.Provider

  - 每个Context 对象都会返回一个Provider React 组件，它允许消费组件订阅context 的变化

  - Provider 接收一个value 属性，传递给消费组件

  - 一个Provider 可以和多个消费组件有对应关系

  - 多个Provider 也可以嵌套使用，里层的会覆盖外层的数据

  - 当Provider 的value 值发生变化时，它内部的所有消费组件都会重新渲染

    ```js
    <UserContext.Provider value={{nickname: "kobe", age: 30}}>
      <ThemeContext.Provider value={{color: "red", size: "30"}}>
        <Home {...info}/>
      </ThemeContext.Provider>
    </UserContext.Provider>
    ```

- Class.contextType

  - 挂载在class 上的contextType属性会被重赋值为一个由React.createContext()创建的Context 对象

  - 这能让你使用this.context来消费最近Context 上的那个值

  - 你可以在任何生命周期中访问到它，包括render 函数中

    ```js
    HomeInfo.contextType = ThemeContext
    ```

- Context.Consumer

  - 这里，React 组件也可以订阅到context 变更。这能让你在函数式组件中完成订阅context

  - 这里需要函数作为子元素（function as child）这种做法

  - 这个函数接收当前的context 值，返回一个React 节点

    ```js
    <UserContext.Consumer>
      {
        value => {
          return <h2>Info User: {value.nickname}</h2>
        }
      }
    </UserContext.Consumer>
    ```


## setState是异步

- 开发中我们并不能直接通过修改state的值来让界面发生更新：

  - 因为我们修改了state之后，希望React根据最新的State来重新渲染界面，但是这种方式的修改React并不知道数据发生了变
    化
  - React并没有实现类似于Vue2中的Object.defineProperty或者Vue3中的Proxy的方式来监听数据的变化
  - 我们必须通过setState来告知React数据已经发生了变化

- setState的更新是异步的？

  ```js
  this.setState({ message: "你好啊,李银河" })
  console.log(this.state.message) // Hello Word
  // 可见setState是异步的操作，我们并不能在执行完setState之后立马拿到最新的state的结果
  ```

- 为什么setState设计为异步呢？
  - React核心成员（Redux的作者）Dan Abramov也有对应的回复
  - https://github.com/facebook/react/issues/11527
- 总结：
  - setState设计为异步，可以显著的提升性能
    - 如果每次调用setState都进行一次更新，那么意味着render函数会被频繁调用，界面重新渲染，这样效率是很低的
    - 最好的办法应该是获取到多个更新，之后进行批量更新
  - 如果同步更新了state，但是还没有执行render函数，那么state和props不能保持同步
    - state和props不能保持一致性，会在开发中产生很多的问题
    - 就像鱼和熊掌不可得兼一样，react在设计的时候也需要舍弃一些东西

- 那么如何可以获取到更新后的值呢？
  - setState接受两个参数：第二个参数是一个回调函数，这个回调函数会在更新后会执行
  - 格式如下：`setState(partialState, callback)`

### setState一定是异步吗？（React18之前）

- 其实分成两种情况：

  - 在组件生命周期或React合成事件中，setState是异步；

  - 在**setTimeout**或者**原生dom事件**中，setState是同步!

    ```js
    setTimeout(() => {
      this.setState({ message: "你好啊, 李银河" })
      console.log(this.state.message)
    }, 0)
    ```

### setState默认是异步的（React18之后）

- 在React18之后，默认所有的操作都被放到了批处理中（异步处理）

- 如果希望代码可以同步会拿到，则需要执行特殊的flushSync操作

  ```js
  import { flushSync } from 'react-dom'
  flushSync(() => {
    this.setState({ message: "你好啊, 李银河" })
  })
  console.log(this.state.message)
  ```


## React性能优化SCU

### React更新机制

- React的渲染流程：

  - jsx -> 虚拟dom -> 真实dom

- 那么React的更新流程呢？

  <img src="/react/image-20221228135338946.png" alt="image-20221228135338946" style="zoom:50%;" />

- React需要基于这两颗不同的树之间的差别来判断如何有效的更新UI
  - 如果一棵树参考另外一棵树进行完全比较更新，那么即使是最先进的算法，该算法的复杂程度为 O(n³)，其中 n 是树中元素的数量
  - 如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围
  - 这个开销太过昂贵了，React的更新性能会变得非常低效
- 于是，React对这个算法进行了优化，将其优化成了O(n)
  - 同层节点之间相互比较，不会垮节点比较
  - 不同类型的节点，产生不同的树结构
  - 开发中，可以通过key来指定哪些节点在不同的渲染下保持稳定

### render函数被调用

<img src="/react/image-20221228140020991.png" alt="image-20221228140020991" style="zoom:50%;" />

- 在这个组件树中，我们只要是修改了 App中的数据，所有的组件都需要重新render，进行diff算法，性能必然是很低的
  - 事实上，很多的组件没有必须要重新render（有些子组件并没有依赖父组件的数据，那么父组件的state修改，子组件为了性能优化，不应该render的）
  - 它们调用render应该有一个前提，就是依赖的数据（state、props）发生改变时，再调用自己的render方法
- 如何来控制render方法是否被调用呢？
  - 通过shouldComponentUpdate方法即可

### shouldComponentUpdate

- React给我们提供了一个生命周期方法 shouldComponentUpdate（很多时候，我们简称为SCU），这个方法接受参数，并且需要有
  返回值
- 该方法有两个参数
  - 参数一：nextProps 修改之后，最新的props属性
  - 参数二：nextState 修改之后，最新的state属性
- 该方法返回值是一个boolean类型
  - 返回值为true，那么就需要调用render方法
  - 返回值为false，那么久不需要调用render方法
  - 默认返回的是true，也就是只要state发生改变，就会调用render方法

```js
shouldComponentUpdate(newProps, nextState) {
  // 自己对比state是否发生改变: this.state和nextState
  if (this.props.message !== newProps.message) {
    return true
  }
  return false
}
```

### PureComponent

- 如果所有的类，我们都需要手动来实现 shouldComponentUpdate，那么会给我们开发者增加非常多的工作量

  - 我们来设想一下shouldComponentUpdate中的各种判断的目的是什么？
  - props或者state中的数据是否发生了改变，来决定shouldComponentUpdate返回true或者false

- 事实上React已经考虑到了这一点，所以React已经默认帮我们实现好了

  - 将class继承自PureComponent

  ```js
  import React, { PureComponent } from 'react'
  
  export class Home extends PureComponent {
    render() {
      return (
        <div>Home</div>
      )
    }
  }
  
  export default Home
  ```

### shallowEqual方法

- 在react源码中就是用这个方法对state、props进行比较
  - 这个方法中，调用 `!shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)`，这个shallowEqual就是
    进行浅层比较
  - 所以在以下例子中要使用**第二种方法对books进行新增书籍**
  - 因为在PureComponent中是进行**浅层比较**，就是**如果引用类型 就会只比较books最外层的内存地址**
  - 所以**第一种方法并没有改变内存地址**，那么**在PureComponent中，数据是没有改变的，那么dom就不会更新**

```js
this.state = {
  books: [
    { name: "你不知道JS", price: 99, count: 1 },
    { name: "JS高级程序设计", price: 88, count: 1 },
    { name: "React高级设计", price: 78, count: 2 },
    { name: "Vue高级设计", price: 95, count: 3 },
  ]
}

addNewBook() {
  const newBook = { name: "Angular高级设计", price: 88, count: 1 }

  // 1.直接修改原有的state, 重新设置一遍
  // 在PureComponent是不能引入重新渲染(re-render)
  this.state.books.push(newBook)
  this.setState({ books: this.state.books })

  // 2.赋值一份books, 在新的books中修改, 设置新的books
  const books = [...this.state.books]
  books.push(newBook)

  this.setState({ books: books })
}
```

### 高阶组件memo

- 目前我们是针对类组件可以使用PureComponent，那么函数式组件呢？

  - 事实上函数式组件我们在props没有改变时，也是不希望其重新渲染其DOM树结构的

- 我们需要使用一个高阶组件memo：

  ```js
  import { memo } from "react"
  
  const Profile = memo(function(props) {
    console.log("profile render")
    return <h2>Profile: {props.message}</h2>
  })
  
  export default Profile
  ```

## 如何使用ref

- 如何创建refs来获取对应的DOM呢？目前有三种方式 **(获取类组件实例也是同理)**
  - 方式一：传入字符串
    - 使用时通过 this.refs.传入的字符串格式获取对应的元素(已经被废弃)
  - 方式二：传入一个对象
    - 对象是通过 React.createRef() 方式创建出来的
    - 使用时获取到创建的对象其中有一个current属性就是对应的元素
  - 方式三：传入一个函数
    - 函数会在DOM被挂载时进行回调，这个函数会传入一个 元素对象，我们可以自己保存
    - 使用时，直接拿到之前保存的元素对象即可

```js
import React, { PureComponent, createRef } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {

    }

    this.titleRef = createRef()
    this.titleEl = null
  }

  getNativeDOM() {
    // 1.方式一: 在React元素上绑定一个ref字符串
    console.log(this.refs.why)

    // 2.方式二: 提前创建好ref对象, createRef(), 将创建出来的对象绑定到元素
    console.log(this.titleRef.current)

    // 3.方式三: 传入一个回调函数, 在对应的元素被渲染之后, 回调函数被执行, 并且将元素传入
    console.log(this.titleEl)
  }

  render() {
    return (
      <div>
        <h2 ref="why">Hello World</h2>
        <h2 ref={this.titleRef}>你好啊,李银河</h2>
        <h2 ref={el => this.titleEl = el}>你好啊, 师姐</h2>
        <button onClick={e => this.getNativeDOM()}>获取DOM</button>
      </div>
    )
  }
}

export default App
```

- 函数式组件是没有实例的，所以无法通过ref获取他们的实例
  - 但是某些时候，我们可能想要获取函数式组件中的某个DOM元素
  - 这个时候我们可以通过 React.forwardRef 

```js
import React, { PureComponent, createRef, forwardRef } from 'react'


const HelloWorld = forwardRef(function(props, ref) {
  return (
    <div>
      <h1 ref={ref}>Hello World</h1>
      <p>哈哈哈</p>
    </div>
  )
})


export class App extends PureComponent {
  constructor() {
    super()

    this.hwRef = createRef()
  }

  getComponent() {
    console.log(this.hwRef.current)
  }

  render() {
    return (
      <div>
        <HelloWorld ref={this.hwRef}/>
        <button onClick={e => this.getComponent()}>获取组件实例</button>
      </div>
    )
  }
}

export default App
```

## 受控组件

- 在React中，HTML表单的处理方式和普通的DOM元素不太一样：表单元素通常会保存在一些内部的state
- 在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素通常自己维护 state，并根据用户输入进
  行更新
- 而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新
  - 将两者结合起来，使React的state成为唯一数据源
  - 渲染表单的 React 组件还控制着用户输入过程中表单发生的操作
  - 被 React 以这种方式控制取值的表单输入元素就叫做“受控组件"
- 由于在表单元素上设置了 value 属性，因此显示的值将始终为 this.state.value，这使得 React 的 state 成为唯一数据源
- 由于 onChange 在每次按键时都会执行并更新 React 的 setState，因此显示的值将随着用户输入而更新

```js
import React, { createRef, PureComponent } from 'react'

export class App extends PureComponent {

  constructor() {
    super()

    this.state = {
      username: "",
      password: "",
      isAgree: false,
      hobbies: [
        { value: "sing", text: "唱", isChecked: false },
        { value: "dance", text: "跳", isChecked: false },
        { value: "rap", text: "rap", isChecked: false }
      ],
      fruit: ["orange"],
      intro: "哈哈哈"
    }

    this.introRef = createRef()
  }

  componentDidMount() {
    // this.introRef.current.addEventListener
  }

  handleSubmitClick(event) {
    // 1.阻止默认的行为
    event.preventDefault()

    // 2.获取到所有的表单数据, 对数据进行组件
    console.log("获取所有的输入内容")
    console.log(this.state.username, this.state.password)
    const hobbies = this.state.hobbies.filter(item => item.isChecked).map(item => item.value)
    console.log("获取爱好: ", hobbies)
    console.log("获取结果:", this.introRef.current.value)

    // 3.以网络请求的方式, 将数据传递给服务器(ajax/fetch/axios)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleAgreeChange(event) {
    this.setState({ isAgree: event.target.checked })
  }

  handleHobbiesChange(event, index) {
    const hobbies = [...this.state.hobbies]
    hobbies[index].isChecked = event.target.checked
    this.setState({ hobbies })
  }

  handleFruitChange(event) {
    const options = Array.from(event.target.selectedOptions)
    const values = options.map(item => item.value)
    this.setState({ fruit: values })

    // 额外补充: Array.from(可迭代对象)
    // Array.from(arguments)
    const values2 = Array.from(event.target.selectedOptions, item => item.value)
    console.log(values2)
  }

  render() {
    const { username, password, isAgree, hobbies, fruit, intro } = this.state

    return (
      <div>
        <form onSubmit={e => this.handleSubmitClick(e)}>
          {/* 1.用户名和密码 */}
          <div>
            <label htmlFor="username">
              用户: 
              <input 
                id='username' 
                type="text" 
                name='username' 
                value={username} 
                onChange={e => this.handleInputChange(e)}
              />
            </label>
            <label htmlFor="password">
              密码: 
              <input 
                id='password' 
                type="password" 
                name='password' 
                value={password} 
                onChange={e => this.handleInputChange(e)}
              />
            </label>
          </div>

          {/* 2.checkbox单选 */}
          <label htmlFor="agree">
            <input 
              id='agree' 
              type="checkbox" 
              checked={isAgree} 
              onChange={e => this.handleAgreeChange(e)}
            />
            同意协议
          </label>

          {/* 3.checkbox多选 */}
          <div>
            您的爱好:
            {
              hobbies.map((item, index) => {
                return (
                  <label htmlFor={item.value} key={item.value}>
                    <input 
                      type="checkbox"
                      id={item.value} 
                      checked={item.isChecked}
                      onChange={e => this.handleHobbiesChange(e, index)}
                    />
                    <span>{item.text}</span>
                  </label>
                )
              })
            }
          </div>

          {/* 4.select */}
          <select value={fruit} onChange={e => this.handleFruitChange(e)} multiple>
            <option value="apple">苹果</option>
            <option value="orange">橘子</option>
            <option value="banana">香蕉</option>
          </select>

          {/* 5.非受控组件 */}
          <input type="text" defaultValue={intro} ref={this.introRef} />

          <div>
            <button type='submit'>注册</button>
          </div>
        </form>
      </div>
    )
  }
}

export default App
```

## 高阶组件

- 什么是高阶函数（至少满足以下条件之一）
  - 接受一个或多个函数作为输入
  - 输出一个函数
- 那么什么是高阶组件呢
  - 高阶组件的英文是 Higher-Order Components，简称为 HOC
  - 官方的定义：**高阶组件是参数为组件，返回值为新组件的函数**
    - 首先， 高阶组件 本身不是一个组件，而是一个函数
    - 其次，这个函数的参数是一个组件，返回值也是一个组件

高阶组件示例

```js
import React, { PureComponent } from 'react'

// 定义一个高阶组件
function hoc(Cpn) {
  // 1.定义类组件
  class NewCpn extends PureComponent {
    render() {
      return <Cpn name="why"/>
    }
  }
  return NewCpn
}

class HelloWorld extends PureComponent {
  render() {
    return <h1>Hello World</h1>
  }
}
// 使用高阶组件包裹，相当于对普通组件进行了拦截
// 这样就可以对每个拦截的组件注入属性name
const HelloWorldHOC = hoc(HelloWorld)

export class App extends PureComponent {
  render() {
    return (
      <div>
        <HelloWorldHOC/>
      </div>
    )
  }
}

export default App
```

### 应用一: props的增强

```js
import { PureComponent } from 'react'

// 定义组件: 给一些需要特殊数据的组件, 注入props
function enhancedUserInfo(OriginComponent) {
  class NewComponent extends PureComponent {
    constructor(props) {
      super(props)

      this.state = {
        userInfo: {
          name: "coderhyh",
          level: 99
        }
      }
    }

    render() {
      return <OriginComponent {...this.props} {...this.state.userInfo}/>
    }
  }

  return NewComponent
}

export default enhancedUserInfo

```

使用

```js
import React, { PureComponent } from 'react'
import enhancedUserInfo from './hoc/enhanced_props'
import About from './pages/About'


const Home = enhancedUserInfo(function(props) {
  return <h1>Home: {props.name}-{props.level}-{props.banners}</h1>
})

const Profile = enhancedUserInfo(function(props) {
  return <h1>Profile: {props.name}-{props.level}</h1>
})

const HelloFriend = enhancedUserInfo(function(props) {
  return <h1>HelloFriend: {props.name}-{props.level}</h1>
})

export class App extends PureComponent {
  render() {
    return (
      <div>
        <Home banners={["轮播1", "轮播2"]}/>
        <Profile/>
        <HelloFriend/>

        <About/>
      </div>
    )
  }
}

export default App
```

### 应用二: 利用高阶组件来共享Context

```js
import ThemeContext from "../context/theme_context"

function withTheme(OriginComponment) {
  return (props) => {
    return (
      <ThemeContext.Consumer>
        {
          value => {
            return <OriginComponment {...value} {...props}/>
          }
        }
      </ThemeContext.Consumer>
    )
  }
}

export default withTheme
```

```js
import React, { PureComponent } from 'react'
import ThemeContext from '../context/theme_context'
import withTheme from '../hoc/with_theme'

export class Product extends PureComponent {
  render() {
    const { color, size } = this.props

    return (
      <div>
        <h2>Product: {color}-{size}</h2>
      </div>
    )
  }
}
// 在这里包裹使用
export default withTheme(Product) 
```

### 应用三: 渲染判断鉴权

```js
function loginAuth(OriginComponent) {
  return props => {
    // 从localStorage中获取token
    const token = localStorage.getItem("token")

    if (token) {
      return <OriginComponent {...props}/>
    } else {
      return <h2>请先登录, 再进行跳转到对应的页面中</h2>
    }
  }
}

export default loginAuth
```

```js
import React, { PureComponent } from 'react'
import Cart from './pages/Cart'

export class App extends PureComponent {
  constructor() {
    super()
  }

  loginClick() {
    localStorage.setItem("token", "coderhyh")
    this.forceUpdate()
  }

  render() {
    return (
      <div>
        App
        <button onClick={e => this.loginClick()}>登录</button>
        <Cart/>
      </div>
    )
  }
}
export default App
```

### 应用四: 生命周期劫持

- 也可以利用高阶函数来劫持生命周期，在生命周期中完成自己的逻辑

```js
import { PureComponent } from "react";

function logRenderTime(OriginComponent) {
  return class extends PureComponent {
    UNSAFE_componentWillMount() {
      this.beginTime = new Date().getTime()
    }
  
    componentDidMount() {
      this.endTime = new Date().getTime()
      const interval = this.endTime - this.beginTime
      console.log(`当前${OriginComponent.name}页面花费了${interval}ms渲染完成!`)
    }

    render() {
      return <OriginComponent {...this.props}/>
    }
  }
}

export default logRenderTime
```

### 高阶函数的意义

- 我们会发现利用高阶组件可以针对某些React代码进行更加优雅的处理
- 其实早期的React有提供组件之间的一种复用方式是mixin，目前已经不再建议使用
  - Mixin 可能会相互依赖，相互耦合，不利于代码维护
  - 不同的Mixin中的方法可能会相互冲突
  - Mixin非常多时，组件处理起来会比较麻烦，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性
- 当然，HOC也有自己的一些缺陷
  - HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生非常多的嵌套，这让调试变得非常困难
  - HOC可以劫持props，在不遵守约定的情况下也可能造成冲突
- Hooks的出现，是开创性的，它解决了很多React之前的存在的问题
  - 比如this指向问题、比如hoc的嵌套复杂度问题等等

## Portals的使用

- 某些情况下，我们希望渲染的内容独立于父组件，甚至是独立于当前挂载到的DOM元素中（默认都是挂载到id为root的DOM
  元素上的）
- Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案
  - 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment；
  - 第二个参数（container）是一个 DOM 元素；

示例：modal组件

```js
import React, { PureComponent } from 'react'
import { createPortal } from "react-dom"

export class Modal extends PureComponent {
  render() {
    return createPortal(this.props.children, document.querySelector("#modal"))
  }
}

export default Modal
```

```js
import React, { PureComponent } from 'react'
import { createPortal } from "react-dom"
import Modal from './Modal'

export class App extends PureComponent {
  render() {
    return (
      <div className='app'>
        <h1>App H1</h1>
        {
          createPortal(<h2>App H2</h2>, document.querySelector("#hyh"))
        }

        {/* 2.Modal组件 */}
        <Modal>
          <h2>我是标题</h2>
          <p>我是内容, 哈哈哈</p>
        </Modal>
      </div>
    )
  }
}

export default App
```

## fragment

- 在开发中，我们总是在一个组件中返回内容时包裹一个div元素
- 使用Fragment, Fragment 允许你将子列表分组，而无需向 DOM 添加额外节点
- React还提供了Fragment的短语法：
  -  `<> </>`
  - 但是，如果需要在Fragment中添加key，那么就不能使用短语法

## StrictMode

- StrictMode 是一个用来突出显示应用程序中潜在问题的工具

  - 与 Fragment 一样，StrictMode 不会渲染任何可见的 UI
  - 它为其后代元素触发额外的检查和警告
  - 严格模式检查仅在开发模式下运行；它们不会影响生产构建

- 可以为应用程序的任何部分启用严格模式：不会对`Profile`组件进行检查

  ```js
  import React, { PureComponent, StrictMode } from 'react'
  import Home from './pages/Home'
  import Profile from './pages/Profile'
  
  export class App extends PureComponent {
    render() {
      return (
        <div>
          <StrictMode>
            <Home/>
          </StrictMode>
          <Profile/>
        </div>
      )
    }
  }
  
  export default App
  ```

### 严格模式检查的是什么？

- 识别不安全的生命周期
- 使用过时的ref API
- 检查意外的副作用
  - 这个组件的constructor会被调用两次
  - 这是严格模式下故意进行的操作，让你来查看在这里写的一些逻辑代码被调用多次时，是否会产生一些副作用
  - 在生产环境中，是不会被调用两次的
- 使用废弃的findDOMNode方法
  - 在之前的React API中，可以通过findDOMNode来获取DOM，不过已经不推荐使用了
- 检测过时的context API
  - 早期的Context是通过static属性声明Context对象属性，通过getChildContext返回Context对象等方式来使用Context的
  - 目前这种方式已经不推荐使用

