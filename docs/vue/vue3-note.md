---
title: vue3笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - vue
categories:
 - vue
---

## vue内部实现原理

### vue2与vue3的数据响应原理

::: tip
vue2
:::

- 实现原理：

  - 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）。

  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

    ```js
    Object.defineProperty(data, 'count', {
        get () {}, 
        set () {}
    })
    ```

- 存在问题：

  - 新增属性、删除属性, 界面不会更新。
  - 直接通过下标修改数组, 界面不会自动更新。

::: tip
vue3
:::

- 实现原理:

  - 通过Proxy（代理）: 拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等。

  - 通过Reflect（反射）: 对源对象的属性进行操作。

  - MDN文档中描述的Proxy与Reflect：

    - Proxy：[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

    - Reflect：[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

      ```js
      new Proxy(data, {
      	// 拦截读取属性值
          get (target, prop) {
          	return Reflect.get(target, prop)
          },
          // 拦截设置属性值或添加新属性
          set (target, prop, value) {
          	return Reflect.set(target, prop, value)
          },
          // 拦截删除属性
          deleteProperty (target, prop) {
          	return Reflect.deleteProperty(target, prop)
          }
      })
      
      proxy.name = 'tom'   
      ```

### 虚拟dom

::: tip
vue内是使用的 `proxy` 进行数据劫持  这样就可以知道数据何时变化了

1. 当初次渲染的时候  vue内部会解析模板  把dom对象放到数组对象中  生成虚拟dom

   ​	然后根据虚拟dom生成真实的dom节点 最后插入挂载的节点 完成初次渲染

2. 当数据变化时 会根据原始模板 结合最新的数据 再次生成新的虚拟dom结构

     然后通过diff算法 新旧虚拟dom对比 

   ​	之后生成patch补丁 

   ​	根据补丁记录更改真实的dom节点
:::

::: tip
虚拟dom
:::

```js
[
  {
    tag:"div",
    children:[
      {
        tag:"h1",
        text:10   (data.num)
      },
      {
        tag:"h1",
        text:"world",
        attr:{
          id:"box"  (data.id)
        }
      }
    ]
  }
]
```



## hook

```js
let {ref,onMounted,reactive}=Vue;
reactive --- 创建数组对象
// 业务逻辑更加集中

let app=Vue.createApp({
  // data methods 生命周期 watch computed
  setup() {
    // 递增
    let num = ref(0);//创建动态数据
    let add=()=>{
      num.value++;
    }
    onMounted(()=>{
      setTimeout(()=>{
        num.value=100
      },1000)
    })

    // 输入框
    let userName=ref("");
    let tip=()=>{
      alert(userName.value);
    }


    // 返回出去 在模板中使用
    return {
      num,
      add,
      userName,
      tip
    }
  }
})
app.mount("#app")
```

### 访问dom

```js
<div id="app">
  <div class="box" ref="el"></div>

	<p ref="txt">hello</p>
</div>

let {ref,onMounted,nextTick}=Vue;
let app=Vue.createApp({
  setup(){
    // 创建动态数据
    let el=ref(null);
    let txt=ref(null);

    onMounted(()=>{
      // 访问DOM
      console.log(el.value);
      txt.value.style.color="red";
    })

    nextTick(()=>{
      console.log("DOM更新完毕")
    })

    return{
      el,
      txt
    }
  }
})
app.mount("#app")
```

### props和emit

```html
<body>
  <div id="app">
    <btn v-model:x="num"></btn>
  </div>
</body>
<script>
  let app=Vue.createApp({
    data(){
      return{
        num:100
      }
    }
  })

  app.component("btn",{
    template:`
            <button @click="change">{{x}}</button>
        `,
    props:["x"],
    setup(props,{emit}){
      //通过第一个形参访问接收props对象
      // 第二个形参中结构出emit方法用于触发自定义事件
      console.log(props.x);
      let change=()=>{
        emit("update:x",500)
      }

      return{
        change
      }
    }
  })

  app.mount("#app")
```

### 自定义Hook

自定义Hook主要用来处理复用代码逻辑的一些封装

这个在vue2 就已经有一个东西是Mixins

mixins就是将这些多个相同的逻辑抽离出来，各个组件只需要引入mixins，就能实现一次写代码，多组件受益的效果。

弊端就是 

​	会涉及到覆盖的问题 

​	第二点就是 变量来源不明确（隐式传入），不利于阅读，使代码变得难以维护。

**Vue3 的自定义的hook**

​	Vue3 的 hook函数 相当于 vue2 的 mixin, 不同在与 hooks 是函数
​	Vue3 的 hook函数 可以帮助我们提高代码的复用性, 让我们能在不同的组件中都利用 hooks 函数
​	Vue3 hook 库[Get Started | VueUse](https://vueuse.org/guide/)

示例

```typescript
import { onMounted } from 'vue'

type Options = {
  el: string
}

type Return = {
  Baseurl: string | null
}
export default function (option: Options): Promise<Return> {

  return new Promise((resolve) => {
    onMounted(() => {
      const file: HTMLImageElement = document.querySelector(option.el) as HTMLImageElement;
      file.onload = ():void => {
        resolve({
          Baseurl: toBase64(file)
        })
      }
    })

    const toBase64 = (el: HTMLImageElement): string => {
      const canvas: HTMLCanvasElement = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      canvas.width = el.width
      canvas.height = el.height
      ctx.drawImage(el, 0, 0, canvas.width,canvas.height)
      console.log(el.width);

      return canvas.toDataURL('image/png')
    	}
    })
}
```

## vue3

### 自定义指令批量注册封装

创建一个文件，在里面写入代码

```js
import copy from './v-copy';
// 自定义指令
const directives = {
  copy,
};
// 这种写法可以批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
```

然后在 `main.js` 中导入 `app.use` 即可

::: tip

当然，注册全局属性也可以同样的方法

:::

```js
import { $toCode, $fromCode, $message, $alert, $debounce, $throttle } from './utils';
const globalProperties = {
  $toCode, $fromCode, $message, $alert, $debounce, $throttle
};
export default {
  install(Vue) {
    for (const key in globalProperties) {
      Vue.config.globalProperties[key] = globalProperties[key]
    }
  },
};
```



### 组件的 Provide / Inject

::: tip
`provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。
:::

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```

::: tip
处理响应性
:::

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})

app.component('todo-list-statistics', {
  inject: ['todoLength'],
  created() {
    console.log(`Injected property: ${this.todoLength.value}`) // > 注入的 property: 5
  }
})
```

### 导航守卫

#### 全局前置守卫

```js
router.beforeEach((to, from, next) => {
  // ...
})
to: Route: 即将要进入的目标 路由对象
from: Route: 当前导航正要离开的路由
```

- **`next: Function`**: 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 `next` 方法的调用参数。
  - **`next()`**: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - **`next(false)`**: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - **`next('/')` 或者 `next({ path: '/' })`**: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to` prop](https://router.vuejs.org/zh/api/#to) 或 [`router.push`](https://router.vuejs.org/zh/api/#router-push) 中的选项。
  - **`next(error)`**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

#### 全局解析守卫

::: tip
在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用。
:::

```js
router.beforeResolve
```

#### 全局后置钩子

```js
router.afterEach((to, from) => {
  // ...
})
```

#### 路由独享的守卫

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

#### 组件内的守卫

```js
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    
    next(vm => {
    	// 通过 `vm` 访问组件实例 this
  	})
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

#### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## 动态路由

::: tip
详见 2022.01.12
:::

```js
// admin
let Index={
  template:`
    <h1>管理员首页</h1>
  `
}

let adminRoutes=[{
  path:"/",
  component:Index
}]

// 通常管理员跟不同用户看到的不一样 他们的路由不同
// 首先把公共的路由设置好
// 当登录后确定是管理员用户 那么就添加管理员的路由 然后就可以进入管理员的路由了
setAdminRoute(){
  // 添加管理员相关页面路由
  adminRoutes.forEach(item=>{
    this.$router.addRoute(item);
  })
},
```

## keepalive

::: tip
keepalive可以减少组件切换时重复渲染的问题   提供了激活和失活两个钩子函数  include、exclude设置具体需要被缓存的组件
:::

```html
通过路由中的meta判断需不需要重复渲染
<router-view v-slot="{ Component }">
  <!-- 缓存失活组件 -->
  <keep-alive v-if="$route.meta.needKeepAlive">
    <component :is="Component" />
  </keep-alive>
  <component v-else :is="Component" />
</router-view>
```

```js
// keep-alive包裹之后   页面需要根据参数展示不同内容时 
onActivated(()=>{//挂载 mounted
  console.log("激活")
  getList();
})

onDeactivated(()=>{//卸载 unmounted
  console.log("失活")
})
```



## vuex

```js
// $store.state.arr  访问公共状态
// $store.commit() 触发mutations中的方法 修改数据

// 公共状态
let {createStore}=Vuex;
let store=createStore({
  // 数据  公共data
  state:{
    arr:["a","b","c"],
    loading:false,
    token:localStorage.getItem("token"),
    userinfo:{}
  },
  // 变更数据的方法 公共方法 methods
  mutations:{
    add(state,a){//形参就是数据对象
      state.arr.push(a);
    }
  }
})
```

### 辅助函数

```js
let app=Vue.createApp({
  computed:{ // 在计算属性中获取vuex的变量
    // arr(){
    //     return this.$store.state.arr
    // }
    ...mapState(["arr"])
  },
  methods:{ // 在函数中修改vuex状态
    // add(a){
    //     this.$store.commit("add"	,a);
    // },
    ...mapMutations(["add"])
  }
})
```

## 定义全局函数和变量

`globalProperties`

由于Vue3 没有`Prototype` 属性 使用 `app.config.globalProperties` 代替 然后去定义变量和函数

Vue2

```js
// 之前 (Vue 2.x)
Vue.prototype.$http = () => {}
```

Vue3

```js
// 之后 (Vue 3.x)
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

### filters案例

```typescript
app.config.globalProperties.$filters = {
  format<T extends any>(str: T): string {
    return `$${str}`
  }
}
```

声明文件 不然TS无法正确类型 推导

```typescript
type Filter = {
  format: <T extends any>(str: T) => T
}
// 声明要扩充@vue/runtime-core包的声明.
// 这里扩充"ComponentCustomProperties"接口, 因为他是vue3中实例的属性的类型.
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: Filter
  }
}
```

setup 读取值

```typescript
import { getCurrentInstance, ComponentInternalInstance } from 'vue';

const { appContext } = <ComponentInternalInstance>getCurrentInstance()

console.log(appContext.config.globalProperties.$env);
```

## 编写Vue3插件

插件是自包含的代码，通常向 Vue 添加全局级功能。

你如果是一个对象需要有install方法Vue会帮你自动注入到install 方法 你如果是function 就直接当install 方法去使用



在使用 `createApp()` 初始化 Vue 应用程序后，你可以通过调用 `use()` 方法将插件添加到你的应用程序中。

示例： 实现一个Loading

Loading.Vue

```vue
<template>
<div v-if="isShow" class="loading">
  <div class="loading-content">Loading...</div>
  </div>
</template>

<script setup lang='ts'>
  import { ref } from 'vue';
  const isShow = ref(false)//定位loading 的开关

  const show = () => {
    isShow.value = true
  }
  const hide = () => {
    isShow.value = false
  }
  //对外暴露 当前组件的属性和方法
  defineExpose({
    isShow,
    show,
    hide
  })
</script>



<style scoped lang="less">
  .loading {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    &-content {
      font-size: 30px;
      color: #fff;
    }
  }
</style>
```

Loading.ts

```typescript
import {  createVNode, render, VNode, App } from 'vue';
import Loading from './index.vue'

export default {
  install(app: App) {
    //createVNode vue提供的底层方法 可以给我们组件创建一个虚拟DOM 也就是Vnode
    const vnode: VNode = createVNode(Loading)
    //render 把我们的Vnode 生成真实DOM 并且挂载到指定节点
    render(vnode, document.body)
    // Vue 提供的全局配置 可以自定义
    app.config.globalProperties.$loading = {
      show: () => vnode.component?.exposed?.show(),
      hide: () => vnode.component?.exposed?.hide()
    }
  }
}
```

Main.ts

```typescript
import Loading from './components/loading'

let app = createApp(App)

app.use(Loading)

type Lod = {
  show: () => void,
  hide: () => void
}
//编写ts loading 声明文件放置报错 和 智能提示
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $loading: Lod
  }
}

app.mount('#app')
```

