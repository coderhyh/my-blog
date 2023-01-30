---
title: react笔记(deprecated)
date: 2022-02-17
sidebar: 'auto'
tags:
 - 笔记
categories:
 - react
---

# React

::: tip

jsx => js和html混合的写法

  需要经过编译

  方便理解：新增了数据类型  标签片段 `<div></div>`

​    遇到 < 解析模板片段

​    遇到 {} 解析js

:::



## 初识react

::: tip

语法

:::

```jsx
<div id="app"></div>

<script type="text/babel">
  let x=<h1>hello</h1>;

  // 第一个参数 模板结构
  // 第二个参数 挂载节点
  ReactDOM.render(
    <div> hello </div>,
    document.getElementById("app")
  )
</script>
```

::: tip

插值

:::

```jsx
<script type="text/babel">
  let num=100;
  let url="http://www.baidu.com"

  // 第一个参数 模板结构
  // 第二个参数 挂载节点
  ReactDOM.render(
    <div>
      {/*标签内容插值*/}
      hello {num}
      {/*标签属性 插值*/}
      <a href={url}>百度</a>
    </div>,
    document.getElementById("app")
  )
```

::: tip

类名和样式

:::

```jsx
<h1 className={cn}>hello</h1>
<!-- 外层{}为使用js 对象形式 -->
<h1 style={{fontSize:"50px",color:"blue"}}>行内样式</h1>
```

::: tip

正常jsx并不会解析**标签字符串**  即: `let str="<em>hello</em>"`

如想解析字符串标签 则可以使用 `dangerouslySetInnerHTML` 

:::

```jsx
let str="<em>hello</em>"
ReactDOM.render(
  <div>
    {/*解析字符串标签*/}
    <h1 dangerouslySetInnerHTML={{__html:str}}></h1>
  </div>,
  document.getElementById("app")
)
```

::: warning

注意：

通常来讲，使用代码直接设置 HTML 存在风险，因为很容易无意中使用户暴露于[跨站脚本（XSS）](https://en.wikipedia.org/wiki/Cross-site_scripting)的攻击。

因此，你可以直接在 React 中设置 HTML，但当你想设置 `dangerouslySetInnerHTML` 时，需要向其传递包含 key 为 `__html` 的对象，以此来警示你。

:::

## 函数式组件

```jsx
// 函数式组件 容器组件
// 首字母大写
let List=()=>{
  return <h1>列表</h1>
}

ReactDOM.render(
  <div>
    {List()}
    <List/>
    <List></List>
  </div>,
  document.getElementById("app")
)
```

::: tip

props

:::

```jsx
let List=({a,b})=>{
  return <h1>{a}---{b}</h1>
}

ReactDOM.render(
  <div>
    <List a="100" b="500"/>
  </div>,
  document.getElementById("app")
)
```

::: tip

插槽

`props.children`访问组件标签内填写的内容  ---- Vue slot

:::

```jsx
let Mark=props=>{
  return(
    <div className="wrap">
      <div className="content">{props.children}</div>   
    </div>
  )
}

ReactDOM.render(
  <div>
    <Mark>abc</Mark>
  </div>,
  document.getElementById("app")
)
```

## 类组件

::: tip

创建类组件

:::

```jsx
class Btn extends Component{
  constructor(props){
    super(props);
    // 状态
    this.state={
      num:100
    }
  }
  render(){//当前组件的模板
    let {num}=this.state;
    return(
      <div>
        <button>{num}</button>{/* 使用bind 或 箭头函数都可以 */}
        <button onClick={this.increase.bind(this)}>+</button>    
        <button onClick={()=>{this.increase()}}>+</button>    
        <button onClick={()=>{this.setNum(500)}}>500</button>    
      </div>
    )
  }
  // 书写方法
  increase(){
    this.setState({
      num:this.state.num+1
    })
  }
  setNum(a){
    this.setState({
      num:a
    })
  }
}
```

::: tip

生命周期

:::

```jsx
// 挂载完毕 第一次插入真实DOM
componentDidMount() {
  console.log("挂载完毕", app.innerHTML);
}

// 卸载
componentWillUnmount(){ }

// 组件更新
componentDidUpdate(oldProps,oldState){
  console.log(oldState.list,this.state.list)
}
```

## Hook

::: tip

函数式组件 --- 无状态组件

类组件 --- 具有状态

`Hook` 在函数组件中使用 可以让函数组件拥有状态

:::

```jsx
// useState创建响应状态的hook
// useEffect 处理生命周期相应任务
let {useState,useEffect}=React;

let App=()=>{
  // 响应数据及修改方法
  let [num,setNum]=useState(10)

  // componentDidMount 只在初始时运行一次 可以在这里请求数据
  useEffect(()=>{
    console.log("创建组件")
  },[])

  //  DidMount+Didupdate  初始+任意数据变化
  useEffect(()=>{
    console.log("初始+更新")
  })

  // DidMount+某个数据的更新  ！！！！！
  useEffect(()=>{
    console.log("初始+num变化")
  },[num])

  // 卸载
  useEffect(()=>{
    return ()=>{//卸载时运行
      console.log("卸载")
    }
  },[])

  // 模板
  return(
    <div>
      <h1>{num}</h1>
      <button onClick={()=>setNum(num+1)}>按钮</button>
    </div>
  )
}
```

::: tip

`useEffect` 生命周期是可以写多个的；比如一个作为初始请求；一个作为监听等

:::

## 访问DOM

```jsx
let {useRef}=React;

let App=()=>{
  // 创建ref   ---1
  let btn=useRef(null);

  // 第一次挂载时 mounted
  useEffect(()=>{
    // 通过current属性访问DOM节点  ---3
    console.log(btn.current.offsetHeight);
  },[])

  return (
    <div>
      {/*绑定元素   ---2*/}
      <button ref={btn}>按钮</button>
    </div>
  )
}
```

## 组件通信

::: tip

子到父

:::

```jsx
let Child=({data,del})=>{
  return (
    <ul>
      {
        data.map((item,index)=>{
          {/* 子组件接收 调用 */}
          return <li onClick={()=>del(index)} key={item}>{item}</li>
        })
      }
    </ul>
  )
}

let Parent=()=>{
  let [arr,setArr]=useState(["苹果","西瓜","香蕉"])

  //把函数传给子组件
  let del=index=>{
    let data2=JSON.parse(JSON.stringify(arr));
    data2.splice(index,1);
    setArr(data2);
  }

  return (
    <div>
      {/*谁的数据谁修改   把父组件修改数据的方法 通过props传入子组件*/}
      <Child data={arr} del={del}/>
    </div>
  )
}
```

::: warning 

注意：

如果是类组件的话 在传给子组件的时候 需要**改变this指向**

`<Child data={arr} del={del.bind(this)}/>`

:::

## CLI

::: tip

安装

`npm i create-react-app -g`

`create-react-app project`

:::



## 私有化css

::: tip

正常 `react` 的css都是公用的 

想要css私有化 需要使用 `module`

:::

```css
// 首先创建 fileName.module.css
.title {color: pink}
```

```jsx
// css module 私有化css样式
import style from "fileName.module.css";
//使用
<h1 className={style.title}>首页</h1>
```













