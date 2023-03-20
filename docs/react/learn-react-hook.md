---
title: react hook
date: 2023-01-30
sidebar: 'auto'
tags:
 - 笔记
categories:
 - react
---

## Class组件对比函数式组件

- Hook 是 React 16.8 的新增特性，它可以让我们在不编写class的情况下使用state以及其他的React特性（比如生命周期）
- class组件相对于函数式组件的优势
  - class组件可以定义自己的state，用来**保存组件自己内部的状态**
    - 函数式组件不可以，因为函数每次调用都会产生新的临时变量
  - class组件有自己的生命周期，我们可以在对应的生命周期中完成自己的逻辑
    - 比如在componentDidMount中发送网络请求，并且该生命周期函数只会执行一次
    - 函数式组件在学习hooks之前，如果在函数中发送网络请求，意味着每次重新渲染都会重新发送一次网络请求
  - class组件可以在状态改变时只**会重新执行render函数**以及我们**希望重新调用的生命周期函数componentDidUpdate等**
    - 函数式组件在重新渲染时，**整个函数都会被执行**，似乎没有什么地方可以只让它们调用一次
- **所以，在Hook出现之前，对于上面这些情况我们通常都会编写class组件**

## Class组件存在的问题

- **复杂组件变得难以理解**
  - 我们在最初编写一个class组件时，往往逻辑比较简单，并不会非常复杂。但是随着业务的增多，我们的class组件会变得越来越复杂；
  - 比如`componentDidMount`中，可能就会包含大量的逻辑代码：包括网络请求、一些事件的监听（还需要在
    `componentWillUnmount`中移除）
  - 而对于这样的class实际上非常难以拆分：因为它们的逻辑往往混在一起，强行拆分反而会造成过度设计，增加代码的复杂度
- **难以理解的class**
  - 很多人发现学习ES6的class是学习React的一个障碍
  - 比如在class中，我们必须搞清楚this的指向到底是谁，所以需要花很多的精力去学习this
- **组件复用状态很难**
  - 在前面为了一些状态的复用我们需要通过高阶组件
  - 像之前学习的redux中connect或者react-router中的withRouter，这些高阶组件设计的目的就是为了状态的复用
  - 或者类似于Provider、Consumer来共享一些状态，但是多次使用Consumer时，我们的代码就会存在很多嵌套
  - 这些代码让我们不管是编写和设计上来说，都变得非常困难

## Hook的出现

- Hook的出现，可以解决上面提到的这些问题
- 简单总结一下hooks
  - 它可以让我们在不编写class的情况下使用state以及其他的React特性
  - 但是我们可以由此延伸出非常多的用法，来让我们前面所提到的问题得到解决
- Hook的使用场景
  - Hook的出现基本可以代替我们之前所有使用class组件的地方
  - 但是如果是一个旧的项目，你并不需要直接将所有的代码重构为Hooks，因为它完全向下兼容，你可以渐进式的来使用它
  - Hook只能在函数组件中使用，不能在类组件，或者函数组件之外的地方使用
- Hook 是
  - **完全可选的**：你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook
  - **100% 向后兼容的**：Hook 不包含任何破坏性改动
  - **现在可用**：Hook 已发布于 v16.8.0
- **但是使用它们会有两个额外的规则**
  - **只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。**
    - **这是因为React通过单链表来管理Hooks**
    - **update 阶段，每次调用 useState，链表就会执行 next 向后移动一步。如果将 useState 写在条件判断中，假设条件判断不成立，没有执行里面的 useState 方法，会导致接下来所有的 useState 的取值出现偏移，从而导致异常发生**
  - **只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用**

## useState

- 参数：初始化值，如果不设置为undefined
- 返回值：数组，包含两个元素
  - 元素一：当前状态的值（第一调用为初始化值）
  - 元素二：设置状态值的函数
- useState会帮助我们定义一个 state变量，useState 是一种新方法，它与 class 里面的 this.state 提供的功能完全相同
  - 一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留
- useState接受唯一一个参数，在第一次组件被调用时使用来作为初始化值。（如果没有传递参数，那么初始化值为undefined）

## useEffect

- 目前我们已经通过hook在函数式组件中定义state，那么类似于生命周期这些呢？

  - Effect Hook 可以让你来完成一些类似于class中生命周期的功能
  - 事实上，类似于网络请求、手动更新DOM、一些事件的监听，都是React更新DOM的一些副作用（Side Effects）
  - 所以对于完成这些功能的Hook被称之为 Effect Hook

- useEffect的解析：

  - 通过useEffect的Hook，可以告诉React需要在渲染后执行某些操作
  - useEffect要求我们传入一个回调函数，在React执行完更新DOM操作之后，就会回调这个函数
  - 默认情况下，无论是第一次渲染之后，还是每次更新之后，都会执行这个 回调函数

  ```jsx
  import React, { memo } from 'react'
  import { useState, useEffect } from 'react'
  
  const App = memo(() => {
    const [count, setCount] = useState(200)
  
    useEffect(() => {
      // 当前传入的回调函数会在组件被渲染完成后, 自动执行
      // 网络请求/DOM操作(修改标题)/事件监听
      document.title = count
    })
  
    return (
      <div>
        <h2>当前计数: {count}</h2>
        <button onClick={e => setCount(count+1)}>+1</button>
      </div>
    )
  })
  
  export default App
  ```

### 需要清除Effect

- 在class组件的编写过程中，某些副作用的代码，我们需要在componentWillUnmount中进行清除
  - 比如我们之前的事件总线或Redux中手动调用subscribe
  - 都需要在componentWillUnmount有对应的取消订阅
- useEffect传入的回调函数A本身可以有一个返回值，这个返回值是另外一个回调函数B
  - `type EffectCallback = () => (void | (() => void | undefined));`
- 为什么要在 effect 中返回一个函数？
  - 这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数；
  - 如此可以将添加和移除订阅的逻辑放在一起
  - 它们都属于 effect 的一部分
- **React 何时清除 effect？**
  - React 会在组件**更新和卸载的时候执行清除操作**
  - effect 在每次渲染的时候都会执行

```jsx
import React, { memo, useEffect } from 'react'
import { useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)

  // 负责告知react, 在执行完当前组件渲染之后要执行的副作用代码
  useEffect(() => {
    console.log("监听redux中数据变化, 监听eventBus中的s事件")

    // 返回值: 回调函数 => 组件被重新渲染或者组件卸载的时候执行
    return () => {
      console.log("取消监听redux中数据变化, 取消监听eventBus中的why事件")
    }
  })

  return (
    <div>
      <button onClick={e => setCount(count+1)}>+1({count})</button>
    </div>
  )
})

export default App
```

### 使用多个Effect

- 使用Hook的其中一个目的就是解决class中生命周期经常将很多的逻辑放在一起的问题：
  - 比如网络请求、事件监听、手动修改DOM，这些往往都会放在componentDidMount中
- 使用Effect Hook，我们可以将它们分离到不同的useEffect中

```jsx
import React, { memo, useEffect } from 'react'
import { useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)

  // 负责告知react, 在执行完当前组件渲染之后要执行的副作用代码
  useEffect(() => {
    // 1.修改document的title(1行)
    console.log("修改title")
  })

  // 一个函数式组件中, 可以存在多个useEffect
  useEffect(() => {
    // 2.对redux中数据变化监听(10行)
    console.log("监听redux中的数据")
    return () => {
      // 取消redux中数据的监听
    }
  })

  useEffect(() => {
    // 3.监听eventBus中的事件(15行)
    console.log("监听eventBus的事件")
    return () => {
      // 取消eventBus中的事件监听
    }
  })

  return (
    <div>
      <button onClick={e => setCount(count+1)}>+1({count})</button>
    </div>
  )
})

export default App
```

- Hook 允许我们按照代码的用途分离它们， 而不是像生命周期函数那样
  - React 将按照 effect 声明的顺序依次调用组件中的每一个 effect

### Effect性能优化

- 默认情况下，useEffect的**回调函数会在每次渲染时都重新执行**，但是这会**导致两个问题**
  - 某些代码我们只是希望执行一次即可，类似于componentDidMount和componentWillUnmount中完成的事情；（比如网络请求、订阅和取消订阅）
  - 另外，多次执行也会导致一定的性能问题
- 我们如何决定useEffect在什么时候应该执行和什么时候不应该执行呢？
  - useEffect实际上有两个参数
  - 参数一：执行的回调函数
  - 参数二：该useEffect在哪些state发生变化时，才重新执行；（受谁的影响）

- 但是，如果一个函数我们不希望依赖任何的内容时，也可以传入一个空的数组 []：
  - 那么这里的两个回调函数分别对应的就是componentDidMount和componentWillUnmount生命周期函数了

```jsx
import React, { memo, useEffect } from 'react'
import { useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("Hello World")

  useEffect(() => {
    console.log("修改title:", count)
  }, [count])

  useEffect(() => {
    console.log("监听redux中的数据")
    return () => {}
  }, [])

  useEffect(() => {
    console.log("监听eventBus的why事件")
    return () => {}
  }, [])

  useEffect(() => {
    console.log("发送网络请求, 从服务器获取数据")

    return () => {
      console.log("会在组件被卸载时, 才会执行一次")
    }
  }, [])

  return (
    <div>
      <button onClick={e => setCount(count+1)}>+1({count})</button>
      <button onClick={e => setMessage("你好啊")}>修改message({message})</button>
    </div>
  )
})

export default App
```

## useContext的使用

- 在之前的开发中，我们要在组件中使用共享的Context有两种方式

  - 类组件可以通过 类名.contextType = MyContext方式，在类中获取context
  - 多个Context或者在函数式组件中通过 MyContext.Consumer 方式共享context

- 但是多个Context共享时的方式会存在大量的嵌套

  - Context Hook允许我们通过Hook来直接获取某个Context的值

  ```jsx
  import React, { memo, useContext } from 'react'
  import { UserContext, ThemeContext } from "./context"
  
  const App = memo(() => {
    // 使用Context
    const user = useContext(UserContext)
    const theme = useContext(ThemeContext)
  
    return (
      <div>
        <h2>User: {user.name}-{user.level}</h2>
        <h2 style={{color: theme.color, fontSize: theme.size}}>Theme</h2>
      </div>
    )
  })
  
  export default App
  ```

- 注意事项：

  - 当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重新渲染，并使用最新传递给 MyContext provider 的context value 值

## useReducer

- useReducer仅仅是useState的一种替代方案：

  - 在某些场景下，如果state的处理逻辑比较复杂，我们可以通过useReducer来对其进行拆分
  - 或者这次修改的state需要依赖之前的state时，也可以使用

  ```jsx
  import React, { memo, useReducer } from 'react'
  // import { useState } from 'react'
  
  function reducer(state, action) {
    switch(action.type) {
      case "increment":
        return { ...state, counter: state.counter + 1 }
      case "decrement":
        return { ...state, counter: state.counter - 1 }
      case "add_number":
        return { ...state, counter: state.counter + action.num }
      case "sub_number":
        return { ...state, counter: state.counter - action.num }
      default:
        return state
    }
  }
  
  // useReducer+Context => redux
  
  const App = memo(() => {
    const [state, dispatch] = useReducer(reducer, { counter: 0, friends: [], user: {} })
    
    return (
      <div>
        <h2>当前计数: {state.counter}</h2>
        <button onClick={e => dispatch({type: "increment"})}>+1</button>
        <button onClick={e => dispatch({type: "decrement"})}>-1</button>
        <button onClick={e => dispatch({type: "add_number", num: 5})}>+5</button>
        <button onClick={e => dispatch({type: "sub_number", num: 5})}>-5</button>
        <button onClick={e => dispatch({type: "add_number", num: 100})}>+100</button>
      </div>
    )
  })
  
  export default App
  ```

## useCallback

- useCallback实际的目的是为了进行性能的优化
- 如何进行性能的优化呢？
  - useCallback会返回一个函数的 memoized（记忆的） 值
  - 在依赖不变的情况下，多次定义的时候，返回的值是相同的
- useCallback性能优化的点
  - 当需要将一个函数传递给子组件时, 最好使用useCallback进行优化, 将优化之后的函数, 传递给子组件
- 通常使用useCallback的**目的是不希望子组件进行多次渲染**，**并不是为了函数进行缓存**

:::tip

在函数式组件中， 传给子组件的函数increment，使得子组件可以让父组件count自增

他会在父组件更新时，就会重新执行渲染函数，就**导致了父组件重新创建了一个函数赋值给increment**

那么两次的内存地址不同 就会导致子组件渲染 - 从而降低性能

注：**子组件会在父组件传递的值变化时 就会重新渲染，就算是memo也是会做一个浅层比较的(shallowEqual)**

:::

```jsx
import React, { memo, useState } from 'react'

const HYHome = memo(function(props) {
  const { increment } = props
  console.log("HYHome被渲染")
  return (
    <div>
      <button onClick={increment}>increment+1</button>

      {/* 100个子组件 */}
    </div>
  )
})

function App = memo(() => {
	// 普通的函数
  const increment = () => {
    setCount(count+1)
  }

  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>
			
      <HYHome increment={increment}/>

      <h2>message:{message}</h2>
      <button onClick={e => setMessage(Math.random())}>修改message</button>
    </div>
  )
})
```

:::tip

这个时候就可以使用 **useCallback**，他会在父组件重新渲染时，始终返回第一次创建的函数（就是说他会储存第一次创建函数）

:::

:::warning

注意：在第**21**行，如果传的是`[]`， 那么将不受任何的影响，就会始终是第一次创建的函数，那么第**20**行的count始终会是 **0**，所以每次都会是 **0+1**，那么就造成了 **闭包陷阱**；

可是如果传的是所依赖的count时，那么在count改变时，useCallback就会返回最新创建的函数，然后子组件的memo进行浅层比较，就会导致子组件重新渲染了 （子组件只想使用increment改变父组件的count，并不需要使用count），所以这是没必要的

:::

```jsx{20-21}
import React, { memo, useState } from 'react'

const HYHome = memo(function(props) {
  const { increment } = props
  console.log("HYHome被渲染")
  return (
    <div>
      <button onClick={increment}>increment+1</button>

      {/* 100个子组件 */}
    </div>
  )
})

function App = memo(() => {
  const [count, setCount] = useState(0)
	// 闭包陷阱: useCallback
  const increment = useCallback(function foo() {
    console.log("increment")
    setCount(count+1)
  }, [count])

  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>
			
      <HYHome increment={increment}/>

      <h2>message:{message}</h2>
      <button onClick={e => setMessage(Math.random())}>修改message</button>
    </div>
  )
})
```

**那么就进行进一步优化**

:::tip

在第**25**行传入`[]`，那么这个useCallback将不受任何影响

然后在最外层定义obj，在App组件渲染时就对`obj.num`赋值最新的count

因为引用类型的原因，useCallback就算始终返回第一次创建的函数，那么也会做到更新count的

:::

```jsx{25}
import React, { memo, useState, useCallback, useRef } from 'react'

// props中的属性发生改变时, 组件本身就会被重新渲染
const HYHome = memo(function(props) {
  const { increment } = props
  console.log("HYHome被渲染")
  return (
    <div>
      <button onClick={increment}>increment+1</button>

      {/* 100个子组件 */}
    </div>
  )
})

const obj = {}
const App = memo(function() {
  const [count, setCount] = useState(0)
  
  obj.num = count
  const increment = useCallback(function foo() {
    console.log("increment")
    // setCount(countRef.current + 1)
    setCount(obj.num + 1)
  }, [])

  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>

      <HYHome increment={increment}/>

      <h2>message:{message}</h2>
      <button onClick={e => setMessage(Math.random())}>修改message</button>
    </div>
  )
})
```
:::tip

然后在再做一下小小的优化：把`obj`修改为useRef，那么本次优化就大功告成了！

这在后面useRef中也会讲到：useRef可以保存一个数据，这个对象在整个生命周期中可以保存不变

```jsx
const countRef = useRef()
countRef.current = count
const increment = useCallback(function foo() {
  console.log("increment")
  setCount(countRef.current + 1)
}, [])
```

:::

## useMemo

- useMemo实际的目的也是为了进行性能的优化
- 如何进行性能的优化呢？
  - useMemo返回的也是一个 memoized（记忆的） 值
  - 在依赖不变的情况下，多次定义的时候，返回的值是相同的

:::tip

在使用 `calcNumTotal` 时，那么在组件每次重新渲染时，`calcNumTotal` 都会重新计算一遍，会消耗性能；

这个时候就可以使用`useMemo`优化

:::

```jsx
import React from 'react'
import { useMemo, useState } from 'react'


const HelloWorld = memo(function(props) {
  console.log("HelloWorld被渲染~")
  return <h2>Hello World</h2>
})


function calcNumTotal(num) {
  // console.log("calcNumTotal的计算过程被调用~")
  let total = 0
  for (let i = 1; i <= num; i++) {
    total += i
  }
  return total
}

const App = memo(() => {
  const [count, setCount] = useState(0)
	// 1.浪费性能
  const result = calcNumTotal(50)
  
  // 2.不依赖任何的值, 进行计算
  const result = useMemo(() => {
    return calcNumTotal(50)
  }, [])
  
  // 3.依赖count
  const result = useMemo(() => {
    return calcNumTotal(count*2)
  }, [count])
  
  // 4.useMemo和useCallback的对比
  function fn() {}
  const increment = useCallback(fn, []) 
  const increment2 = useMemo(() => fn, [])

  return (
    <div>
      <h2>计算结果: {result}</h2>
      <h2>计数器: {count}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>
    </div>
  )
})

export default App
```

## useRef

- useRef返回一个ref对象，返回的ref对象再组件的整个生命周期保持不变

- 最常用的ref是两种用法

  - 用法一：引入DOM（或者组件，但是需要是class组件）元素；

  - 用法二：保存一个数据，这个对象在整个生命周期中可以保存不变；

    ```js
    const refContainer = useRef(initialValue)
    ```

- useRef办法的DOM

```jsx
import React, { memo, useRef } from 'react'

const App = memo(() => {
  const titleRef = useRef()
  const inputRef = useRef()
  
  function showTitleDom() {
    console.log(titleRef.current)
    inputRef.current.focus()
  }

  return (
    <div>
      <h2 ref={titleRef}>Hello World</h2>
      <input type="text" ref={inputRef} />
      <button onClick={showTitleDom}>查看title的dom</button>
    </div>
  )
})

export default App
```

## useImperativeHandle

- 先来回顾一下ref和forwardRef结合使用
  - 通过forwardRef可以将ref转发到子组件
  - 子组件拿到父组件中创建的ref，绑定到自己的某一个元素中
- forwardRef的做法本身没有什么问题，但是我们是将子组件的DOM直接暴露给了父组件
  - 直接暴露给父组件带来的问题是某些情况的不可控
  - 父组件可以拿到DOM后进行任意的操作
  - 但是，在某些场景中，我们只是希望父组件可以操作的focus，其他并不希望它随意操作
- 通过useImperativeHandle可以值暴露固定的操作
  - 通过useImperativeHandle的Hook，将传入的ref和useImperativeHandle第二个参数返回的对象绑定到了一起
  - 所以在父组件中，使用 inputRef.current时，实际上使用的是返回的对象
  - 比如我调用了 focus函数，甚至可以调用 printHello函数

```jsx
import React, { memo, useRef, forwardRef, useImperativeHandle } from 'react'

const HelloWorld = memo(forwardRef((props, ref) => {

  const inputRef = useRef()

  // 子组件对父组件传入的ref进行处理
  useImperativeHandle(ref, () => {
    return {
      focus() {
        console.log("focus")
        inputRef.current.focus()
      },
      setValue(value) {
        inputRef.current.value = value
      }
    }
  })

  return <input type="text" ref={inputRef}/>
}))


const App = memo(() => {
  const titleRef = useRef()
  const inputRef = useRef()

  function handleDOM() {
    // console.log(inputRef.current)
    inputRef.current.focus()
    // inputRef.current.value = ""
    inputRef.current.setValue("哈哈哈")
  }

  return (
    <div>
      <h2 ref={titleRef}>哈哈哈</h2>
      <HelloWorld ref={inputRef}/>
      <button onClick={handleDOM}>DOM操作</button>
    </div>
  )
})

export default App
```

## useLayoutEffect

- useLayoutEffect看起来和useEffect非常的相似，事实上他们也只有一点区别而已
  - useEffect**会在渲染的内容更新到DOM上后执行，不会阻塞DOM的更新**
  - useLayoutEffect**会在渲染的内容更新到DOM上之前执行，会阻塞DOM的更新**

- 如果我们希望在某些操作发生之后再更新DOM，那么应该将这个操作放到useLayoutEffect

案例：切换数字

- 使用useEffect

  - **因为useEffect是dom渲染之后执行的**，所以在此案例中使用useEffect，数字会出现闪一下的情况

  ```jsx
  import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
  
  const App = memo(() => {
    const [count, setCount] = useState(100)
  
    useEffect(() => {
      console.log("useEffect")
      if (count === 0) {
        setCount(Math.random() + 99)
      }
    })
  
    console.log("App render")
  
    return (
      <div>
        <h2>count: {count}</h2>
        <button onClick={e => setCount(0)}>设置为0</button>
      </div>
    )
  })
  
  export default App
  ```

- 使用useLayoutEffect

  - 使用useLayoutEffect就可以完美解决
  - **因为useLayoutEffect是在dom渲染之前执行**

  ```jsx
  import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
  
  const App = memo(() => {
    const [count, setCount] = useState(100)
  
    useLayoutEffect(() => {
      console.log("useLayoutEffect")
      if (count === 0) {
        setCount(Math.random() + 99)
      }
    })
  
    console.log("App render")
  
    return (
      <div>
        <h2>count: {count}</h2>
        <button onClick={e => setCount(0)}>设置为0</button>
      </div>
    )
  })
  
  export default App
  ```

## 自定义Hook

- 自定义Hook本质上只是一种函数代码逻辑的抽取，严格意义上来说，它本身并不算React的特性

> 打印生命周期

```jsx
import React, { memo, useEffect, useState } from 'react'

function useLogLife(cName) {
  useEffect(() => {
    console.log(cName + "组件被创建")
    return () => {
      console.log(cName + "组件被销毁")
    }
  }, [cName])
}

const Home = memo(() => {
  useLogLife("home")

  return <h1>Home Page</h1>
})

const About = memo(() => {
  useLogLife("about")

  return <h1>About Page</h1>
})

const App = memo(() => {
  const [isShow, setIsShow] = useState(true)

  useLogLife("app")

  return (
    <div>
      <h1>App Root Component</h1>
      <button onClick={e => setIsShow(!isShow)}>切换</button>
      { isShow && <Home/> }
      { isShow && <About/> }
    </div>
  )
})

export default App
```

> Context获取数据

```jsx
// hooks.js
import { useContext } from "react"
import { UserContext, TokenContext } from "../context"

function useUserToken() {
  const user = useContext(UserContext)
  const token = useContext(TokenContext)

  return [user, token]
}

export default useUserToken
```

```jsx
import React, { memo } from 'react'
import { useUserToken } from "./hooks"

// User/Token

const Home = memo(() => {
  const [user, token] = useUserToken()

  return <h1>Home Page: {user.name}-{token}</h1>
})

const About = memo(() => {
  const [user, token] = useUserToken()

  return <h1>About Page: {user.name}-{token}</h1>
})

const App = memo(() => {
  return (
    <div>
      <h1>App Root Component</h1>
      <Home/>
      <About/>
    </div>
  )
})

export default App
```

> 获取窗口滚动位置

```jsx
// useScrollPosition.js
import { useState, useEffect } from "react"

function useScrollPosition() {
  const [ scrollX, setScrollX ] = useState(0)
  const [ scrollY, setScrollY ] = useState(0)

  useEffect(() => {
    function handleScroll() {
      // console.log(window.scrollX, window.scrollY)
      setScrollX(window.scrollX)
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return [scrollX, scrollY]
}

export default useScrollPosition
```

```jsx
import React, { memo } from 'react'
import useScrollPosition from './hooks/useScrollPosition'
import "./style.css"

const Home = memo(() => {
  const [scrollX, scrollY] = useScrollPosition()

  return <h1>Home Page: {scrollX}-{scrollY}</h1>
})

const About = memo(() => {
  const [scrollX, scrollY] = useScrollPosition()

  return <h1>About Page: {scrollX}-{scrollY}</h1>
})

const App = memo(() => {
  return (
    <div className='app'>
      <h1>App Root Component</h1>
      <Home/>
      <About/>
    </div>
  )
})

export default App
```

## redux hooks

- 在之前的redux开发中，为了让组件和redux结合起来，我们使用了react-redux中的connect
  - 但是这种方式必须使用高阶函数结合返回的高阶组件
  - 并且必须编写：mapStateToProps和 mapDispatchToProps映射的函数
- 在Redux7.1开始，提供了Hook的方式，我们再也不需要编写connect以及对应的映射函数了
  - useSelector的作用是将state映射到组件中
    - 参数一：将state映射到需要的数据中
    - 参数二：可以进行比较来决定是否组件重新渲染 **（查看下方代码）**
  - useSelector默认会比较我们返回的两个对象是否相等
    - 如何比较呢？ const refEquality = (a, b) => a === b
    - 也就是我们必须返回两个完全相等的对象才可以不引起重新渲染
  - useDispatch非常简单，就是直接获取dispatch函数，之后在组件中直接使用即可
  - 还可以通过useStore来获取当前的store对象

:::tip

- 这里 `useSelector` 有一个点，就是如果第二个不传参数的话：
  - 首先第二个参数是用了决定更新state后，当前组件是否重新渲染
  - 比如在下方栗子，Home组件中的message修改了
  - 因为useSelector拿到的state是全局的，那么第二个参数在对比时就发现state被改变了
  - 就会导致父组件App也发生修改，从而导致了性能问题
- 解决办法：
  - 手动对比
    - 第二个参数是传一个函数，有两个值，之前与之后
    - 比如解构出来的是message，那就对比之前跟之后的message如果相等，那么就不重新渲染了
  - 每次手动也是相当麻烦的，redux中已经准备好了shallowEqual方法，导入直接用即可

:::

```jsx
import React, { memo } from 'react'
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { addNumberAction, changeMessageAction, subNumberAction } from './store/modules/counter'


// memo高阶组件包裹起来的组件有对应的特点: 只有props发生改变时, 才会重新渲染
const Home = memo((props) => {
  const { message } = useSelector((state) => ({
    message: state.counter.message
  }), shallowEqual)

  const dispatch = useDispatch()
  function changeMessageHandle() {
    dispatch(changeMessageAction("你好啊, 师姐!"))
  }

  console.log("Home render")

  return (
    <div>
      <h2>Home: {message}</h2>
      <button onClick={e => changeMessageHandle()}>修改message</button>
    </div>
  )
})


const App = memo((props) => {
  // 1.使用useSelector将redux中store的数据映射到组件内
  const { count } = useSelector((state) => ({
    count: state.counter.count
  }), shallowEqual)

  // 2.使用dispatch直接派发action
  const dispatch = useDispatch()
  function addNumberHandle(num, isAdd = true) {
    if (isAdd) {
      dispatch(addNumberAction(num))
    } else {
      dispatch(subNumberAction(num))
    }
  }

  console.log("App render")

  return (
    <div>
      <h2>当前计数: {count}</h2>
      <button onClick={e => addNumberHandle(1)}>+1</button>
      <button onClick={e => addNumberHandle(6)}>+6</button>
      <button onClick={e => addNumberHandle(6, false)}>-6</button>

      <Home/>
    </div>
  )
})

export default App
```

## useId

- **官方的解释：useId 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook**
- 这里有一个词叫hydration，要想理解这个词，我们需要理解一些服务器端渲染（SSR）的概念。
- 什么是SSR？
  - SSR（Server Side Rendering，服务端渲染），指的是页面在服务器端已经生成了完成的HTML页面结构，不需要浏览器解析
  - 对应的是CSR（Client Side Rendering，客户端渲染），我们开发的SPA页面通常依赖的就是客户端渲染
- 早期的服务端渲染包括PHP、JSP、ASP等方式，但是在目前前后端分离的开发模式下，前端开发人员不太可能再去学习PHP、JSP等技术来开发网页
- 不过我们可以借助于Node来帮助我们执行JavaScript代码，提前完成页面的渲染

### SSR同构应用

- 什么是同构？
  - 一套代码既可以在服务端运行又可以在客户端运行，这就是同构应用
- 同构是一种SSR的形态，是现代SSR的一种表现形式
  - 当用户发出请求时，先在服务器通过SSR渲染出首页的内容
  - 但是对应的代码同样可以在客户端被执行
  - 执行的目的包括事件绑定等以及其他页面切换时也可以在客户端被渲染

![image-20230207000857253](/react/image-20230207000857253.png)

### Hydration

- **什么是Hydration？这里引入vite-plugin-ssr插件的官方解释。**

  <img src="/react/image-20230207004022171.png" alt="image-20230207004022171" style="zoom: 50%;" />

- 在进行 SSR 时，我们的页面会呈现为 HTML

  - 但仅 HTML 不足以使页面具有交互性。例如，浏览器端 JavaScript 为零的页面不能是交互式的（没有 JavaScript 事件处理程序响应用户操作，例如单击按钮）
  - 为了使我们的页面具有交互性，除了在 Node.js 中将页面呈现为 HTML 之外，我们的 UI 框架（Vue/React/...）还在浏览器中加载和呈现页面。（它创建页面的内部表示，然后将内部表示映射到我们在 Node.js 中呈现的 HTML 的 DOM 元素。）

- 这个过程称为**hydration**

### useId的作用

- **再来看一遍：useId 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook**
- 所以可以得出如下结论
  - useId是用于react的同构应用开发的，前端的SPA页面并不需要使用它
  - useId可以保证应用程序在客户端和服务器端生成唯一的ID，这样可以有效的避免通过一些手段生成的id不一致，造成hydration mismatch

```jsx
import React, { memo, useId, useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)

  const id = useId()
  console.log(id)

  return (
    <div>
      <button onClick={e => setCount(count+1)}>count+1:{count}</button>

      <label htmlFor={id}>
        用户名:<input id={id} type="text" />
      </label>
    </div>
  )
})

export default App
```

## useTransition

- **官方解释：返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数**
- useTransition到底是干嘛的呢？它其实在告诉react对于某部分任务的更新优先级较低，可以稍后进行更新

```js
import { faker } from '@faker-js/faker';

const namesArray = []

for (let i = 0; i < 10000; i++) {
  namesArray.push(faker.name.fullName())
}

export default namesArray
```



```jsx
import React, { memo, useState, useTransition } from 'react'
import namesArray from './namesArray'

const App = memo(() => {
  const [showNames, setShowNames] = useState(namesArray)
  const [ pending, startTransition ] = useTransition()

  function valueChangeHandle(event) {
    // 把消耗性能的代码稍后执行 - 性能优化
    // 比如这个搜索结果，可以在用户输完之后 先显示loading（变量：pending），稍后显示结果
    startTransition(() => {
      const keyword = event.target.value
      const filterShowNames = namesArray.filter(item => item.includes(keyword))
      setShowNames(filterShowNames)
    })
  }

  return (
    <div>
      <input type="text" onInput={valueChangeHandle}/>
      <h2>用户名列表: {pending && <span>data loading</span>} </h2>
      <ul>
        {
          showNames.map((item, index) => {
            return <li key={index}>{item}</li>
          })
        }
      </ul>
    </div>
  )
})

export default App
```

## useDeferredValue

- **官方解释：useDeferredValue 接受一个值，并返回该值的新副本，该副本将推迟到更紧急地更新之后**
- 在明白了useTransition之后，我们就会发现useDeferredValue的作用是一样的效果，可以让我们的更新延迟
  - 只不过没有了loading

```jsx
import React, { memo, useState, useDeferredValue } from 'react'
import namesArray from './namesArray'

const App = memo(() => {
  const [showNames, setShowNames] = useState(namesArray)
  const deferedShowNames = useDeferredValue(showNames)

  function valueChangeHandle(event) {
    const keyword = event.target.value
    const filterShowNames = namesArray.filter(item => item.includes(keyword))
    setShowNames(filterShowNames)
  }

  return (
    <div>
      <input type="text" onInput={valueChangeHandle}/>
      <h2>用户名列表: </h2>
      <ul>
        {
          deferedShowNames.map((item, index) => {
            return <li key={index}>{item}</li>
          })
        }
      </ul>
    </div>
  )
})

export default App
```
